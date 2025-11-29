import { api } from '../../../shared/api';
import type { User } from '../types/auth.types';

/**
 * API de autenticación
 * Funciones para comunicarse con el backend
 */
export const authAPI = {
  /**
   * Iniciar sesión
   */
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const { data } = await api.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });
    
    return data;
  },
  
  /**
   * Verificar autenticación con token
   */
  checkAuth: async (token: string): Promise<User> => {
    const { data } = await api.get<User>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return data;
  },

  /**
   * Cerrar sesión
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  }
};
