import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { initProgress } from '@/state/store'
import { ThemeEffect } from '@/app/ThemeEffect'
import { ReminderEffect } from '@/app/ReminderEffect'
import { router } from '@/app/router'
import { setStorageAdapter } from '@/core/storage/store'
import { createNativeAdapter, preloadNativeValue } from '@/core/storage/nativeAdapter'
import { initIap } from '@/core/iap'
import { MONETIZATION } from '@/core/features'
import './index.css'

async function bootstrap() {
  if (Capacitor.isNativePlatform()) {
    setStorageAdapter(createNativeAdapter(await preloadNativeValue()))
  }

  // Load persisted progress only after the native storage adapter is in place.
  initProgress()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeEffect />
      <ReminderEffect />
      <RouterProvider router={router} />
    </StrictMode>,
  )

  // The web IAP SDK is a sizeable chunk (~230 KB gzip) — only load it, and only on
  // idle, when monetization is actually turned on.
  if (MONETIZATION) {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500))
    idle(() => void initIap())
  }
}

bootstrap()
