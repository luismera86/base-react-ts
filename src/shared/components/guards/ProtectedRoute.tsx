import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router'
import type { Permission, UserRole } from '../../types'

interface Props {
  children?: ReactNode
  requiredRole?: UserRole | UserRole[]
  requireAllRoles?: boolean
  requiredPermissions?: Permission[]
  fallback?: ReactNode
}

export const ProtectedRoute = ({ children, fallback }: Props) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : <Navigate to="/auth" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
