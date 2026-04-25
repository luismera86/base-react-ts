import { create } from 'zustand'
import type { AuthStore } from '../types/auth.types'
import * as authService from '../services/auth.service'

export const useAuthStore = create<AuthStore>((set) => ({
  // Estado inicial
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,

  // Obtener todos los items
  fetchItems: async () => {
    set({ isLoading: true, error: null })
    try {
      const items = await authService.getAllAuths()
      set({ items, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar items',
        isLoading: false,
      })
    }
  },

  // Obtener un item específico
  getItem: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const item = await authService.getAuthById(id)
      set({ currentItem: item, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar item',
        isLoading: false,
      })
    }
  },

  // Crear un nuevo item
  createItem: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const newItem = await authService.createAuth(data)
      set((state) => ({
        items: [...state.items, newItem],
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear item',
        isLoading: false,
      })
      throw error
    }
  },

  // Actualizar un item
  updateItem: async (id: string, data) => {
    set({ isLoading: true, error: null })
    try {
      const updatedItem = await authService.updateAuth(id, data)
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItem : item)),
        currentItem: state.currentItem?.id === id ? updatedItem : state.currentItem,
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar item',
        isLoading: false,
      })
      throw error
    }
  },

  // Eliminar un item
  deleteItem: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await authService.deleteAuth(id)
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        currentItem: state.currentItem?.id === id ? null : state.currentItem,
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al eliminar item',
        isLoading: false,
      })
      throw error
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),
}))
