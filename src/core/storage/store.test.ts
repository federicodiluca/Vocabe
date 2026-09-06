import { describe, expect, it } from 'vitest'
import { normalize, defaultState } from './store'

describe('normalize', () => {
  it('falls back to a fresh state for junk input', () => {
    expect(normalize(null).learned).toEqual({})
    expect(normalize('nope').favorites).toEqual([])
    expect(normalize(42).onboarded).toBe(false)
  })

  it('fills in fields added after a save was written', () => {
    const old = { learned: {}, streak: { current: 3, longest: 3, lastActiveOn: '2026-03-10' } }
    const s = normalize(old)
    expect(s.streak.freezes).toBe(0)
    expect(s.favorites).toEqual([])
    expect(s.notes).toEqual({})
    expect(s.settings.theme).toBe('system')
    expect(s.streak.current).toBe(3) // existing values survive
  })

  it('backfills activeDays from the days words were learned', () => {
    const s = normalize({
      learned: {
        a: { learnedOn: '2026-03-02', box: 1, dueOn: '2026-03-03', correct: 0, wrong: 0 },
        b: { learnedOn: '2026-03-01', box: 1, dueOn: '2026-03-02', correct: 0, wrong: 0 },
      },
      streak: { current: 1, longest: 1, lastActiveOn: '2026-03-05' },
    })
    expect(s.activeDays).toEqual(['2026-03-01', '2026-03-02', '2026-03-05'])
  })

  it('keeps activeDays when already present', () => {
    const s = normalize({ activeDays: ['2026-01-01'], learned: {} })
    expect(s.activeDays).toEqual(['2026-01-01'])
  })

  it('does not show the intro to someone with existing progress', () => {
    const withProgress = normalize({
      learned: { a: { learnedOn: '2026-03-01', box: 1, dueOn: '2026-03-02', correct: 0, wrong: 0 } },
    })
    expect(withProgress.onboarded).toBe(true)
    expect(normalize({ learned: {} }).onboarded).toBe(false)
  })

  it('respects an explicit onboarded flag', () => {
    expect(normalize({ onboarded: false, learned: {}, activeDays: ['2026-01-01'] }).onboarded).toBe(false)
  })

  it('round-trips a full state', () => {
    const s = defaultState()
    s.favorites = ['effimero']
    s.notes = { effimero: 'bella parola' }
    expect(normalize(JSON.parse(JSON.stringify(s)))).toEqual(s)
  })
})
