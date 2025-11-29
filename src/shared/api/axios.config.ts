import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

/**
 * Configuración base de Axios
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para agregar el token a las peticiones
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth-token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para manejar respuestas y errores
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Si el token expiró o es inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    
    // Manejar otros errores
    const errorMessage = error.response?.data 
      ? (error.response.data as { message?: string }).message 
      : error.message;
    
    return Promise.reject(new Error(errorMessage || 'Error en la petición'));
  }
);

/**
 * Helper para extraer mensaje de error
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido';
};
