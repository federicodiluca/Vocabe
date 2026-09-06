import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { useProgressSlice } from '@/state/hooks'

/** Native only: match the status bar to the current theme. */
async function syncStatusBar(dark: boolean) {
  if (!Capacitor.isNativePlatform()) return
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    // Style.Light = light icons (for a dark background); Style.Dark = dark icons.
    await StatusBar.setStyle({ style: dark ? Style.Light : Style.Dark })
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: dark ? '#1c1917' : '#faf7f2' })
    }
  } catch {
    /* plugin not present */
  }
}

/**
 * Applies the appearance settings to <html>: theme (tracking the OS preference
 * when set to "system"), reading typeface and text size.
 */
export function AppearanceEffect() {
  const theme = useProgressSlice((s) => s.settings.theme)
  const readingFont = useProgressSlice((s) => s.settings.readingFont)
  const textSize = useProgressSlice((s) => s.settings.textSize)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', dark ? '#1c1917' : '#faf7f2')
      void syncStatusBar(dark)
    }
    apply()
    if (theme === 'system') {
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('reading-sans', readingFont === 'sans')
  }, [readingFont])

  useEffect(() => {
    document.documentElement.classList.toggle('text-grande', textSize === 'grande')
  }, [textSize])

  return null
}
