import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './Layout'
import { DailyPage } from '@/features/daily/DailyPage'
import { RecallPage } from '@/features/recall/RecallPage'
import { ProgressPage } from '@/features/progress/ProgressPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DailyPage /> },
      { path: 'ripasso', element: <RecallPage /> },
      { path: 'progressi', element: <ProgressPage /> },
      { path: 'impostazioni', element: <SettingsPage /> },
    ],
  },
])
