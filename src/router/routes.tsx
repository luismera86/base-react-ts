import { createBrowserRouter } from 'react-router'
import { authRoutes } from '../features/auth'
import { NotFound } from '../pages/NotFound'
import { DashboardLayout, ProtectedRoute } from '../shared'

export const router = createBrowserRouter([
  ...authRoutes,
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [],
  },
  { path: '*', element: <NotFound /> },
])
