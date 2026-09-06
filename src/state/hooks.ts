import { useSyncExternalStore } from 'react'
import type { ProgressState } from '@/core/types'
import { getProgress, subscribeProgress } from './store'

/**
 * Subscribe to one slice of the progress state.
 *
 * The selector must return something referentially stable between updates —
 * a primitive, or a slice held directly on the state. Returning a fresh array
 * or object (`.map()`, `{ ... }`) on every call makes React re-render forever:
 * select the raw slice and derive it with `useMemo` in the component instead.
 */
export function useProgressSlice<T>(select: (s: ProgressState) => T): T {
  const snapshot = () => select(getProgress())
  return useSyncExternalStore(subscribeProgress, snapshot, snapshot)
}

/** The whole state — for the few screens that genuinely read most of it. */
export function useProgressState(): ProgressState {
  return useProgressSlice((s) => s)
}

export function useIsLearned(wordId: string): boolean {
  return useProgressSlice((s) => wordId in s.learned)
}

export function useIsFavorite(wordId: string): boolean {
  return useProgressSlice((s) => s.favorites.includes(wordId))
}

export function useNote(wordId: string): string {
  return useProgressSlice((s) => s.notes[wordId] ?? '')
}
