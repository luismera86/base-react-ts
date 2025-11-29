import type { RouteObject } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";

/**
 * Rutas del feature de autenticación
 */
export const authRoutes: RouteObject[] = [
  {
    path: "login",
    element: <LoginPage />,
  },
];
