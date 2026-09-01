import type { ProgressState, Word } from '@/core/types'
import { displayStreak } from '@/core/streak/streak'
import { dayNumber } from '@/core/date'

/** Wordle-style shareable line — no spoiler of the meaning. */
export function shareText(word: Word, state: ProgressState): string {
  const n = dayNumber() - 20_000 // small, friendly running number
  const streak = displayStreak(state.streak)
  const learned = Object.keys(state.learned).length
  const fire = streak > 0 ? ` 🔥${streak}` : ''
  return [
    `Vocabe #${n} — oggi ho imparato «${word.term}»${fire}`,
    `${learned} parole imparate finora.`,
    'https://vocabe.app',
  ].join('\n')
}

export async function shareWord(word: Word, state: ProgressState): Promise<'shared' | 'copied' | 'failed'> {
  const text = shareText(word, state)
  const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> }
  if (nav.share) {
    try {
      await nav.share({ text })
      return 'shared'
    } catch {
      return 'failed'
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}
