import { useEffect } from 'react'
import { useProgressSlice } from '@/state/hooks'

/** Applies the theme setting to <html>, tracking the OS preference when set to "system". */
export function ThemeEffect() {
  const theme = useProgressSlice((s) => s.settings.theme)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', dark ? '#1c1917' : '#faf7f2')
    }
    apply()
    if (theme === 'system') {
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [theme])

  return null
}
