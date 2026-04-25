import type { ReactNode } from 'react'
import type { UserRole } from '../../types'

interface Props {
  children: ReactNode
  requiredRole?: UserRole | UserRole[]
  requireAllRoles?: boolean
  fallback?: ReactNode
}

// Placeholder — conectar con auth store cuando esté implementado
export const RoleGuard = ({ children }: Props) => <>{children}</>
