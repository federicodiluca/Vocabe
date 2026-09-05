import { createContext, useContext } from 'react'
import type { ProgressState, Settings } from '@/core/types'

export type ProgressContextValue = {
  state: ProgressState
  isLearned: (wordId: string) => boolean
  markLearned: (wordId: string) => void
  unmarkLearned: (wordId: string) => void
  recordRecall: (wordId: string, correct: boolean) => void
  isFavorite: (wordId: string) => boolean
  toggleFavorite: (wordId: string) => void
  setNote: (wordId: string, text: string) => void
  updateSettings: (patch: Partial<Settings>) => void
  completeOnboarding: () => void
  replaceState: (next: ProgressState) => void
  resetAll: () => void
}

export const ProgressCtx = createContext<ProgressContextValue | null>(null)

export function useProgress(): ProgressContextValue {
  const v = useContext(ProgressCtx)
  if (!v) throw new Error('useProgress must be used within <ProgressProvider>')
  return v
}
