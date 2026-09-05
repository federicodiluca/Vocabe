import type { ProgressState, Settings } from '@/core/types'
import { localDateKey } from '@/core/date'

export const KEY = 'vocabe:v1'
export const STATE_VERSION = 1

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  reminderTime: '08:30',
  reminderEnabled: false,
  name: '',
}

export function defaultState(): ProgressState {
  const today = localDateKey()
  return {
    version: STATE_VERSION,
    learned: {},
    streak: { current: 0, longest: 0, lastActiveOn: null, freezes: 0 },
    badges: [],
    activeDays: [],
    favorites: [],
    notes: {},
    onboarded: false,
    settings: { ...DEFAULT_SETTINGS },
    startedOn: today,
  }
}

/**
 * Storage adapter. Web uses localStorage; the native build swaps this for
 * Capacitor Preferences without touching callers.
 */
export interface StorageAdapter {
  read(): string | null
  write(value: string): void
}

const webAdapter: StorageAdapter = {
  read() {
    try {
      return localStorage.getItem(KEY)
    } catch {
      return null
    }
  },
  write(value) {
    try {
      localStorage.setItem(KEY, value)
    } catch {
      /* private mode / quota — state stays in memory for this session */
    }
  },
}

let adapter: StorageAdapter = webAdapter
export function setStorageAdapter(a: StorageAdapter) {
  adapter = a
}

/** Fill in any missing fields and run version migrations. */
export function normalize(input: unknown): ProgressState {
  const base = defaultState()
  if (!input || typeof input !== 'object') return base
  const s = input as Partial<ProgressState>
  const learned = s.learned && typeof s.learned === 'object' ? s.learned : base.learned
  const streak = { ...base.streak, ...(s.streak ?? {}) }

  let activeDays = Array.isArray(s.activeDays) ? s.activeDays : []
  if (activeDays.length === 0) {
    // Backfill for pre-heatmap saves: the days words were learned, plus the last active day.
    const days = new Set(Object.values(learned).map((e) => e.learnedOn))
    if (streak.lastActiveOn) days.add(streak.lastActiveOn)
    activeDays = [...days].sort()
  }

  return {
    version: STATE_VERSION,
    learned,
    streak,
    badges: Array.isArray(s.badges) ? s.badges : base.badges,
    activeDays,
    favorites: Array.isArray(s.favorites) ? s.favorites : base.favorites,
    notes: s.notes && typeof s.notes === 'object' ? s.notes : base.notes,
    // Existing users (any learned words or activity) shouldn't suddenly see the intro.
    onboarded:
      typeof s.onboarded === 'boolean'
        ? s.onboarded
        : Object.keys(learned).length > 0 || activeDays.length > 0,
    settings: { ...base.settings, ...(s.settings ?? {}) },
    startedOn: typeof s.startedOn === 'string' ? s.startedOn : base.startedOn,
  }
}

export function loadState(): ProgressState {
  const raw = adapter.read()
  if (!raw) return defaultState()
  try {
    return normalize(JSON.parse(raw))
  } catch {
    return defaultState()
  }
}

export function saveState(state: ProgressState): void {
  adapter.write(JSON.stringify(state))
}

export function exportState(state: ProgressState): string {
  return JSON.stringify(state, null, 2)
}

export function parseImported(text: string): ProgressState {
  return normalize(JSON.parse(text))
}
