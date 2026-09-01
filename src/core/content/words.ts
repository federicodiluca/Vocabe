import type { Word } from '@/core/types'
import { dayNumber } from '@/core/date'
import raw from '@/data/words.json'

export const WORDS = raw as Word[]

const BY_ID = new Map(WORDS.map((w) => [w.id, w]))

export function getWord(id: string): Word | undefined {
  return BY_ID.get(id)
}

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic shuffle — same seed always yields the same order. */
function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const out = arr.slice()
  const rnd = mulberry32(seed)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * The word for a given day. Every word appears once before any repeats; each full
 * pass through the list is reshuffled, so the order never looks cyclic.
 */
export function wordForDay(d: Date = new Date()): Word {
  const n = dayNumber(d)
  const len = WORDS.length
  const pass = Math.floor(n / len)
  const order = seededShuffle(WORDS, 0x5f3a_21c7 ^ pass)
  return order[((n % len) + len) % len]
}
