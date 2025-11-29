import { Navigate, useLocation } from 'react-router-dom';
import { useRouteAccess } from '../../../features/auth/hooks/useAuth.hook';
import { useAuth } from '../../../features/auth/store/auth.store';
import type { ProtectedRouteProps } from '../../../features/auth/types/auth.types';
import { AuthLoader } from '../ui/AuthLoader';
import { AccessDenied } from '../ui/AccessDenied';

/**
 * Componente principal para proteger rutas
 */
export const ProtectedRoute = ({
  children,
  requiredRole,
  requiredPermissions,
  fallback,
  redirectTo = '/login',
  requireAllRoles = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  const hasAccess = useRouteAccess({
    requiredRole,
    requiredPermissions,
    requireAllPermissions: true,
    requireAllRoles
  });

  // Mostrar loader mientras se verifica la autenticación
  if (isLoading) {
    return <AuthLoader />;
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Mostrar acceso denegado si no tiene permisos
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Generar mensaje descriptivo basado en los requerimientos
    let message = 'No tienes permisos para acceder a esta página.';
    
    if (requiredRole) {
      if (Array.isArray(requiredRole)) {
        const rolesList = requiredRole.join(', ');
        message = requireAllRoles 
          ? `Se requieren todos estos roles: ${rolesList}` 
          : `Se requiere uno de estos roles: ${rolesList}`;
      } else {
        message = `Se requiere rol ${requiredRole} para acceder a esta página.`;
      }
    } else if (requiredPermissions && requiredPermissions.length > 0) {
      message = 'Se requieren permisos específicos para acceder a esta página.';
    }
    
    return (
      <AccessDenied message={message} />
    );
  }

  // Renderizar el contenido protegido
  return <>{children}</>;
};
