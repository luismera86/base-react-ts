/**
 * Types para el feature auth
 */

export interface Auth {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  items: Auth[]
  currentItem: Auth | null
  isLoading: boolean
  error: string | null
}

export interface AuthActions {
  fetchItems: () => Promise<void>
  getItem: (id: string) => Promise<void>
  createItem: (data: Omit<Auth, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateItem: (id: string, data: Partial<Auth>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  clearError: () => void
}

export interface AuthStore extends AuthState, AuthActions {}
