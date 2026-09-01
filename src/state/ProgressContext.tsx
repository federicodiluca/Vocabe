import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { ProgressState, Settings } from '@/core/types'
import { loadState, saveState, defaultState } from '@/core/storage/store'
import { touchStreak } from '@/core/streak/streak'
import { evaluateBadges } from '@/core/badges/badges'
import { newEntry, grade } from '@/core/srs/leitner'
import { localDateKey } from '@/core/date'
import { ProgressCtx, type ProgressContextValue } from './context'

/** Run badge evaluation and fold newly earned ids into the state. */
function withBadges(state: ProgressState): ProgressState {
  const earned = evaluateBadges(state)
  return earned.length ? { ...state, badges: [...state.badges, ...earned] } : state
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadState())
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    saveState(state)
  }, [state])

  const isLearned = useCallback((wordId: string) => wordId in state.learned, [state.learned])

  const markLearned = useCallback((wordId: string) => {
    setState((s) => {
      if (wordId in s.learned) return s
      const today = localDateKey()
      const next: ProgressState = {
        ...s,
        learned: { ...s.learned, [wordId]: newEntry(today) },
        streak: touchStreak(s.streak, today),
      }
      return withBadges(next)
    })
  }, [])

  const unmarkLearned = useCallback((wordId: string) => {
    setState((s) => {
      if (!(wordId in s.learned)) return s
      const learned = { ...s.learned }
      delete learned[wordId]
      return { ...s, learned }
    })
  }, [])

  const recordRecall = useCallback((wordId: string, correct: boolean) => {
    setState((s) => {
      const entry = s.learned[wordId]
      if (!entry) return s
      const today = localDateKey()
      const next: ProgressState = {
        ...s,
        learned: { ...s.learned, [wordId]: grade(entry, correct, today) },
        streak: touchStreak(s.streak, today),
      }
      return withBadges(next)
    })
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
  }, [])

  const replaceState = useCallback((next: ProgressState) => setState(withBadges(next)), [])
  const resetAll = useCallback(() => setState(defaultState()), [])

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      isLearned,
      markLearned,
      unmarkLearned,
      recordRecall,
      updateSettings,
      replaceState,
      resetAll,
    }),
    [state, isLearned, markLearned, unmarkLearned, recordRecall, updateSettings, replaceState, resetAll],
  )

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>
}
