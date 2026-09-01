import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ProgressProvider } from '@/state/ProgressContext'
import { ThemeEffect } from '@/app/ThemeEffect'
import { router } from '@/app/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressProvider>
      <ThemeEffect />
      <RouterProvider router={router} />
    </ProgressProvider>
  </StrictMode>,
)
