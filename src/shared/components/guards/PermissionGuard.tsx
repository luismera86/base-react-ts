import type { ReactNode } from 'react'
import type { Permission } from '../../types'

interface Props {
  children: ReactNode
  requiredPermissions?: Permission[]
  fallback?: ReactNode
}

// Placeholder — conectar con auth store cuando esté implementado
export const PermissionGuard = ({ children }: Props) => <>{children}</>
