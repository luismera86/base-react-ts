import { api } from '../../../shared/api'
import type { Auth } from '../types/auth.types'

/**
 * Obtener todos los auths
 */
export const getAllAuths = async (): Promise<Auth[]> => {
  const { data } = await api.get<Auth[]>('/auths')
  return data
}

/**
 * Obtener un auth por ID
 */
export const getAuthById = async (id: string): Promise<Auth> => {
  const { data } = await api.get<Auth>(`/auths/${id}`)
  return data
}

/**
 * Crear un nuevo auth
 */
export const createAuth = async (
  item: Omit<Auth, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Auth> => {
  const { data } = await api.post<Auth>('/auths', item)
  return data
}

/**
 * Actualizar un auth
 */
export const updateAuth = async (id: string, item: Partial<Auth>): Promise<Auth> => {
  const { data } = await api.put<Auth>(`/auths/${id}`, item)
  return data
}

/**
 * Eliminar un auth
 */
export const deleteAuth = async (id: string): Promise<void> => {
  await api.delete(`/auths/${id}`)
}
