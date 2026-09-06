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
 * Shuffling 386 words is pure waste to repeat: for a given seed the order never
 * changes, and the seed only changes once per full pass through the list.
 */
const orderCache = new Map<number, Word[]>()
function shuffledOnce(pool: readonly Word[], seed: number): Word[] {
  let order = orderCache.get(seed)
  if (!order) {
    order = seededShuffle(pool, seed)
    orderCache.set(seed, order)
  }
  return order
}

const MAIN_SEED = 0x5f3a_21c7
const BONUS_SEED = 0x9e37_79b9

/** Guaranteed minimum number of days before a word can come round again. */
export const MIN_REPEAT_GAP = 30

/**
 * Each pass through the list is its own shuffle, so on its own the last words of
 * one pass could reappear among the first of the next — measured worst case was
 * 5 days. This pushes any word from the previous pass's tail out of this pass's
 * head, which guarantees at least MIN_REPEAT_GAP days between repeats.
 */
const passCache = new Map<number, Word[]>()
function orderForPass(pass: number): Word[] {
  let order = passCache.get(pass)
  if (order) return order

  order = shuffledOnce(WORDS, MAIN_SEED ^ pass).slice()
  const edge = Math.min(MIN_REPEAT_GAP - 1, Math.floor(WORDS.length / 2))
  if (pass > 0 && edge > 0) {
    const tail = new Set(
      shuffledOnce(WORDS, MAIN_SEED ^ (pass - 1))
        .slice(-edge)
        .map((w) => w.id),
    )
    let swap = edge
    for (let i = 0; i < edge; i++) {
      if (!tail.has(order[i].id)) continue
      while (swap < order.length && tail.has(order[swap].id)) swap++
      if (swap >= order.length) break
      ;[order[i], order[swap]] = [order[swap], order[i]]
      swap++
    }
  }

  passCache.set(pass, order)
  return order
}

/**
 * The word for a given day. Every word appears exactly once per pass through the
 * list, and never twice within MIN_REPEAT_GAP days.
 */
export function wordForDay(d: Date = new Date()): Word {
  const n = dayNumber(d)
  const len = WORDS.length
  return orderForPass(Math.floor(n / len))[((n % len) + len) % len]
}

/**
 * A second word for the day. Depends only on the date — deliberately *not* on
 * what the reader has already learned, or the card would swap to another word
 * the moment you mark this one as learned.
 */
export function bonusWordForDay(d: Date = new Date()): Word | null {
  const len = WORDS.length
  if (len < 2) return null

  const today = wordForDay(d)
  const n = dayNumber(d)
  // Shuffle the whole (stable) list so the cache key can be the seed alone,
  // then step past today's word if the index happens to land on it.
  const order = shuffledOnce(WORDS, BONUS_SEED ^ Math.floor(n / len))
  const start = ((n % len) + len) % len
  for (let i = 0; i < len; i++) {
    const candidate = order[(start + i) % len]
    if (candidate.id !== today.id) return candidate
  }
  return null
}
