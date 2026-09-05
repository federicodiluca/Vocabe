import type { ProgressState, Word } from '@/core/types'
import { displayStreak } from '@/core/streak/streak'
import { siteUrl } from '@/core/site'

/** Short shareable text — no spoiler of the meaning. */
export function shareText(word: Word, state: ProgressState): string {
  const streak = displayStreak(state.streak)
  const learned = Object.keys(state.learned).length
  const stats =
    streak > 0
      ? `${learned} parole imparate, serie di ${streak} giorni.`
      : `${learned} parole imparate finora.`
  return [`Oggi su Vocabe ho imparato «${word.term}».`, stats, siteUrl()].join('\n')
}

export type ImageShareResult = 'shared' | 'unsupported' | 'cancelled' | 'failed'

/** Try the native share sheet with the PNG attached. Returns `unsupported` if the
 * platform can't share files, so the caller can offer a download instead. */
export async function shareImageFile(blob: Blob, text: string): Promise<ImageShareResult> {
  const file = new File([blob], 'vocabe.png', { type: 'image/png' })
  const nav = navigator as Navigator & {
    canShare?: (d: ShareData) => boolean
    share?: (d: ShareData) => Promise<void>
  }
  if (!nav.share || !nav.canShare?.({ files: [file] })) return 'unsupported'
  try {
    await nav.share({ files: [file], text })
    return 'shared'
  } catch (e) {
    return (e as Error).name === 'AbortError' ? 'cancelled' : 'failed'
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
