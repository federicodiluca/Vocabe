import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

const REMINDER_ID = 1001

/**
 * Schedules (or clears) the daily reminder to match the given settings.
 * No-op on the web — Capacitor plugins only run inside the native shell.
 */
export async function syncReminder(enabled: boolean, time: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return

  await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] })
  if (!enabled) return

  const granted = await ensurePermission()
  if (!granted) return

  const [hour, minute] = time.split(':').map(Number)
  await LocalNotifications.schedule({
    notifications: [
      {
        id: REMINDER_ID,
        title: 'Vocabe',
        body: 'La parola di oggi ti aspetta.',
        schedule: { on: { hour, minute }, allowWhileIdle: true },
      },
    ],
  })
}

async function ensurePermission(): Promise<boolean> {
  const current = await LocalNotifications.checkPermissions()
  if (current.display === 'granted') return true
  const requested = await LocalNotifications.requestPermissions()
  return requested.display === 'granted'
}
