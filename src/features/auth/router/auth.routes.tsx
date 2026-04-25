import type { RouteObject } from 'react-router'
import { AuthPage } from '../pages/Auth'

export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthPage />,
  },
]
