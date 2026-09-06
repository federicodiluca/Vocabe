import type { Word } from '@/core/types'
import { WORDS, getWord } from '@/core/content/words'

export type Direction = 'forward' | 'inverse'

export type Question = {
  word: Word
  direction: Direction
  /** the term (forward) or the definition (inverse) */
  prompt: string
  options: string[]
  answer: number
}

export const QUIZ_LENGTH = 8
/** From this Leitner box on, the harder "definition → word" direction kicks in. */
export const INVERSE_FROM_BOX = 3
const OPTIONS = 4

export type Rng = () => number

function shuffle<T>(arr: readonly T[], rnd: Rng): T[] {
  const out = arr.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const byCategory = new Map<string, Word[]>()
for (const w of WORDS) {
  const key = w.category ?? 'senza-categoria'
  const bucket = byCategory.get(key)
  if (bucket) bucket.push(w)
  else byCategory.set(key, [w])
}

/**
 * Distractors drawn at random from the whole list are usually giveaways — a
 * literary term next to three everyday ones answers itself. Fill from the
 * narrowest pool first (same category and difficulty), widening only to top up.
 */
function distractorsFor(word: Word, count: number, rnd: Rng): Word[] {
  const chosen: Word[] = []
  const used = new Set([word.id])
  const sameCategory = byCategory.get(word.category ?? 'senza-categoria') ?? []

  const tiers: readonly Word[][] = [
    sameCategory.filter((w) => w.difficulty === word.difficulty),
    sameCategory,
    WORDS,
  ]

  for (const tier of tiers) {
    if (chosen.length >= count) break
    for (const candidate of shuffle(tier, rnd)) {
      if (chosen.length >= count) break
      if (used.has(candidate.id)) continue
      used.add(candidate.id)
      chosen.push(candidate)
    }
  }
  return chosen
}

export function makeQuestion(word: Word, direction: Direction, rnd: Rng = Math.random): Question {
  const distractors = distractorsFor(word, OPTIONS - 1, rnd)
  const correct = direction === 'inverse' ? word.term : word.meaning
  const options = shuffle(
    [correct, ...distractors.map((w) => (direction === 'inverse' ? w.term : w.meaning))],
    rnd,
  )
  return {
    word,
    direction,
    prompt: direction === 'inverse' ? word.meaning : word.term,
    options,
    answer: options.indexOf(correct),
  }
}

/** Builds one round of recall questions from the words that are due. */
export function buildQuiz(
  due: readonly { id: string; box: number }[],
  rnd: Rng = Math.random,
): Question[] {
  return shuffle(due, rnd)
    .slice(0, QUIZ_LENGTH)
    .flatMap(({ id, box }) => {
      const word = getWord(id)
      if (!word) return []
      return [makeQuestion(word, box >= INVERSE_FROM_BOX ? 'inverse' : 'forward', rnd)]
    })
}
