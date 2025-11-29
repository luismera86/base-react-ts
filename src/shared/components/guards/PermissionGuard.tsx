import { useAuth } from '../../../features/auth/store/auth.store';
import type { Permission } from '../../../features/auth/types/auth.types';

interface PermissionGuardProps {
  children: React.ReactNode;
  permissions: Permission | Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

/**
 * Componente para mostrar contenido basado en permisos
 */
export const PermissionGuard = ({
  children,
  permissions,
  requireAll = true,
  fallback,
  showFallback = false
}: PermissionGuardProps) => {
  const { user } = useAuth();
  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
  
  const userPermissions = user?.permissions || [];
  
  const hasPermission = requireAll
    ? permissionsArray.every(permission => userPermissions.some(p => p === permission))
    : permissionsArray.some(permission => userPermissions.some(p => p === permission));

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showFallback) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                No tienes los permisos necesarios para ver este contenido.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  }

  return <>{children}</>;
};
