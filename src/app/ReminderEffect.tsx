import { useEffect } from 'react'
import { useProgressSlice } from '@/state/hooks'
import { syncReminder } from '@/core/notifications/reminder'

/** Keeps the native daily reminder in sync with the user's settings. */
export function ReminderEffect() {
  const reminderEnabled = useProgressSlice((s) => s.settings.reminderEnabled)
  const reminderTime = useProgressSlice((s) => s.settings.reminderTime)

  useEffect(() => {
    syncReminder(reminderEnabled, reminderTime)
  }, [reminderEnabled, reminderTime])

  return null
}
