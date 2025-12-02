import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute, DashboardLayout, NotFound } from "../shared";
import { authRoutes } from "../features/auth";
import { dashboardRoutes } from "../features/dashboard";
import { adminRoutes } from "../features/admin";

/**
 * Router principal de la aplicación
 * Importa y combina las rutas de cada feature de forma modular
 */
export const router = createBrowserRouter([
  // ========================================
  // Rutas públicas (Auth)
  // ========================================
  ...authRoutes,
  
  // ========================================
  // Rutas protegidas con layout
  // ========================================
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Rutas del Dashboard
      ...dashboardRoutes,
      
      // Rutas de Administración
      ...adminRoutes,
    ],
  },

  // ========================================
  // Ruta 404 - Debe estar al final
  // ========================================
  {
    path: "*",
    element: <NotFound />,
  },
]);
