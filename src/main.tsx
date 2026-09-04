import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { ProgressProvider } from '@/state/ProgressContext'
import { ThemeEffect } from '@/app/ThemeEffect'
import { ReminderEffect } from '@/app/ReminderEffect'
import { router } from '@/app/router'
import { setStorageAdapter } from '@/core/storage/store'
import { createNativeAdapter, preloadNativeValue } from '@/core/storage/nativeAdapter'
import { initIap } from '@/core/iap'
import './index.css'

async function bootstrap() {
  if (Capacitor.isNativePlatform()) {
    setStorageAdapter(createNativeAdapter(await preloadNativeValue()))
  }

  // Entitlement status arrives async and updates the UI via useIsPro — don't block first paint on it.
  void initIap()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ProgressProvider>
        <ThemeEffect />
        <ReminderEffect />
        <RouterProvider router={router} />
      </ProgressProvider>
    </StrictMode>,
  )
}

bootstrap()
