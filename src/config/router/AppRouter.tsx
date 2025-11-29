import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useAuth } from '../../features/auth';

export const AppRouter = () => {
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Inicializar la autenticación al cargar la app
    checkAuth();
  }, [checkAuth]);

  return <RouterProvider router={router} />;
};
