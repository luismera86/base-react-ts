import type { RouteObject } from "react-router-dom";
import { UserDashboard } from "../pages/UserDashboard";
import { ProtectedRoute } from "../../../shared";

/**
 * Rutas del feature de dashboard
 */
export const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
];
