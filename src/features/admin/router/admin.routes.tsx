import type { RouteObject } from "react-router-dom";
import { AdminPanel } from "../pages/AdminPanel";
import { ProtectedRoute } from "../../../shared";
import { UserRole, Permission } from "../../auth";

/**
 * Rutas del feature de administración
 */
export const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    element: (
    <ProtectedRoute
      requiredRole={UserRole.ADMIN}
      fallback={
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600">
            Se requiere rol de administrador para acceder a esta sección.
          </p>
        </div>
      }
    >
      <AdminPanel />
    </ProtectedRoute>
    ),
  },
  {
    path: "users",
    element: (
    <ProtectedRoute
      requiredPermissions={[Permission.READ_USERS]}
      fallback={
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Permisos Insuficientes
          </h2>
          <p className="text-gray-600">
            No tienes permisos para ver la lista de usuarios.
          </p>
        </div>
      }
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
        <p className="text-gray-600">
          Esta sección requiere permisos de lectura de usuarios.
        </p>
      </div>
    </ProtectedRoute>
    ),
  },
  {
    path: "reports",
    element: (
    <ProtectedRoute
      requiredPermissions={[Permission.READ_REPORTS]}
      fallback={
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sin Acceso a Reportes
          </h2>
          <p className="text-gray-600">
            No tienes permisos para ver los reportes del sistema.
          </p>
        </div>
      }
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Reportes del Sistema</h1>
        <p className="text-gray-600">
          Esta sección requiere permisos de lectura de reportes.
        </p>
      </div>
    </ProtectedRoute>
    ),
  },
  {
    path: "moderator",
    element: (
    <ProtectedRoute
      requiredRole={UserRole.MODERATOR}
      fallback={
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Área de Moderadores
          </h2>
          <p className="text-gray-600">
            Se requiere rol de moderador o superior para acceder.
          </p>
        </div>
      }
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Panel de Moderador</h1>
        <p className="text-gray-600">
          Bienvenido al área de moderadores.
        </p>
      </div>
    </ProtectedRoute>
    ),
  },
  {
    path: "admin-or-mod",
    element: (
    <ProtectedRoute 
      requiredRole={[UserRole.ADMIN, UserRole.MODERATOR]}
      fallback={
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600">
            Se requiere ser administrador o moderador para acceder.
          </p>
        </div>
      }
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Área Admin/Moderador</h1>
        <p className="text-gray-600">
          Esta sección está disponible tanto para administradores como para moderadores.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900">Ejemplo de uso:</h3>
          <code className="text-sm text-blue-800">
            requiredRole={[UserRole.ADMIN, UserRole.MODERATOR]}
          </code>
        </div>
      </div>
    </ProtectedRoute>
    ),
  },
  {
    path: "all-users",
    element: (
    <ProtectedRoute 
      requiredRole={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER]}
      fallback={
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Solo para Usuarios Registrados</h2>
          <p className="text-gray-600">
            Se requiere ser usuario registrado (no invitado).
          </p>
        </div>
      }
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Área para Todos los Usuarios</h1>
        <p className="text-gray-600">
          Esta sección está disponible para todos los usuarios registrados (Admin, Moderador, Usuario).
        </p>
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-900">Ejemplo de uso:</h3>
          <code className="text-sm text-green-800">
            requiredRole={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER]}
          </code>
        </div>
      </div>
    </ProtectedRoute>
    ),
  },
];
