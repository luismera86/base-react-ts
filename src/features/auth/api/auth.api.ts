import type { User } from '../types/auth.types';
import { MOCK_USERS } from '../types/auth.types';

/**
 * API de autenticación
 * En una aplicación real, estas funciones harían llamadas HTTP a un backend
 */
export const authAPI = {
  /**
   * Iniciar sesión
   */
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Simulamos delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Lógica de autenticación simple para demo
    const userKey = email.split('@')[0];
    const user = MOCK_USERS[userKey];
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // En un app real, verificarías la contraseña aquí
    if (password !== 'password123') {
      throw new Error('Contraseña incorrecta');
    }
    
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    return { user, token };
  },
  
  /**
   * Verificar autenticación con token
   */
  checkAuth: async (token: string): Promise<User> => {
    // Simulamos verificación de token
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!token || !token.startsWith('mock-jwt-token')) {
      throw new Error('Token inválido');
    }
    
    // Extraer ID de usuario del token mock
    const parts = token.split('-');
    const userId = parts[3];
    
    const user = Object.values(MOCK_USERS).find(u => u.id === userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user;
  },

  /**
   * Cerrar sesión
   */
  logout: async (): Promise<void> => {
    // Simulamos llamada al backend
    await new Promise(resolve => setTimeout(resolve, 300));
    // En una app real, invalidarías el token en el servidor
  }
};
