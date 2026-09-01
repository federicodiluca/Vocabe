import type { ProgressState } from '@/core/types'
import { daysBetween, localDateKey } from '@/core/date'

/**
 * Register activity for `today` and return the updated streak block.
 * Same-day calls are idempotent. A one-day gap keeps the streak growing;
 * anything longer resets it to 1.
 */
export function touchStreak(streak: ProgressState['streak'], today = localDateKey()) {
  if (streak.lastActiveOn === today) return streak

  const gap = streak.lastActiveOn ? daysBetween(streak.lastActiveOn, today) : Infinity
  const current = gap === 1 ? streak.current + 1 : 1
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveOn: today,
  }
}

/** A streak shown in the UI is "broken" once more than a day has passed. */
export function displayStreak(streak: ProgressState['streak'], today = localDateKey()): number {
  if (!streak.lastActiveOn) return 0
  return daysBetween(streak.lastActiveOn, today) <= 1 ? streak.current : 0
}
