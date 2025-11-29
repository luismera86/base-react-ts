// Public API del feature Auth
// Solo exportamos lo que necesitan otros módulos

// Store y hooks
export { useAuth, useUser, useIsAuthenticated, useAuthLoading, useAuthError, useAuthStore } from './store/auth.store';
export { usePermissions, useRole, useAccess, useRouteAccess } from './hooks/useAuth.hook';

// Tipos
export type { User, AuthState, ProtectedRouteProps } from './types/auth.types';
export { UserRole, Permission, ROLE_PERMISSIONS } from './types/auth.types';

// Páginas
export { LoginPage } from './pages/LoginPage';

// Router
export { authRoutes } from './router/auth.routes';

// Componentes (solo si se necesitan fuera del feature)
export { LoginForm } from './components/LoginForm';
export { LoginHeader } from './components/LoginHeader';
