import { describe, expect, it } from 'vitest'
import { WORDS, getWord, wordForDay, bonusWordForDay, MIN_REPEAT_GAP } from './words'

const at = (iso: string) => new Date(`${iso}T12:00:00`)

describe('dataset', () => {
  it('has unique ids and terms', () => {
    expect(new Set(WORDS.map((w) => w.id)).size).toBe(WORDS.length)
    expect(new Set(WORDS.map((w) => w.term)).size).toBe(WORDS.length)
  })

  it('looks words up by id', () => {
    expect(getWord(WORDS[0].id)).toBe(WORDS[0])
    expect(getWord('non-esiste')).toBeUndefined()
  })
})

describe('wordForDay', () => {
  it('is stable for the same date', () => {
    expect(wordForDay(at('2026-03-10')).id).toBe(wordForDay(at('2026-03-10')).id)
  })

  it('changes from one day to the next', () => {
    expect(wordForDay(at('2026-03-10')).id).not.toBe(wordForDay(at('2026-03-11')).id)
  })

  it('uses every word exactly once per pass through the list', () => {
    // A pass is aligned to the day counter, so walk one starting from a boundary.
    const dayZero = new Date(Date.UTC(1970, 0, 1, 12))
    const passStart = new Date(dayZero)
    passStart.setDate(passStart.getDate() + 60 * WORDS.length)

    const seen = new Set<string>()
    for (let i = 0; i < WORDS.length; i++) {
      const d = new Date(passStart)
      d.setDate(d.getDate() + i)
      seen.add(wordForDay(d).id)
    }
    expect(seen.size).toBe(WORDS.length)
  })

  // Regression: independent shuffles per pass let a word come back after 5 days
  // at the seam between one pass and the next.
  it(`never repeats a word within ${MIN_REPEAT_GAP} days, including across passes`, () => {
    const start = at('2026-01-01')
    const lastSeen = new Map<string, number>()
    let shortest = Infinity

    for (let i = 0; i < WORDS.length * 4; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      const id = wordForDay(d).id
      const previous = lastSeen.get(id)
      if (previous !== undefined) shortest = Math.min(shortest, i - previous)
      lastSeen.set(id, i)
    }

    expect(shortest).toBeGreaterThanOrEqual(MIN_REPEAT_GAP)
  })
})

describe('bonusWordForDay', () => {
  it('never returns the main word of the day', () => {
    const start = at('2026-01-01')
    for (let i = 0; i < 60; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      expect(bonusWordForDay(d)!.id).not.toBe(wordForDay(d).id)
    }
  })

  // Regression: it used to skip words already marked as learned, so the card
  // swapped to a different word the instant you learned the one on screen.
  it('depends only on the date', () => {
    const d = at('2026-03-10')
    expect(bonusWordForDay(d)!.id).toBe(bonusWordForDay(d)!.id)
    expect(bonusWordForDay(d)!.id).not.toBe(bonusWordForDay(at('2026-03-11'))!.id)
  })
})
