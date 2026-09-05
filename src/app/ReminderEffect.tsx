import { useEffect } from 'react'
import { useProgress } from '@/state/context'
import { syncReminder } from '@/core/notifications/reminder'

/** Keeps the native daily reminder in sync with the user's settings. */
export function ReminderEffect() {
  const { state } = useProgress()
  const { reminderEnabled, reminderTime } = state.settings

  useEffect(() => {
    syncReminder(reminderEnabled, reminderTime)
  }, [reminderEnabled, reminderTime])

  return null
}
