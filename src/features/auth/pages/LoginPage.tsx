import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth.store';
import { LoginHeader } from '../components/LoginHeader';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, error, clearError } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Error de login:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginHeader />
        
        <LoginForm
          onSubmit={handleLogin}
          isSubmitting={isSubmitting}
          error={error}
          onClearError={clearError}
        />
      </div>
    </div>
  );
};
