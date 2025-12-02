# Base React TypeScript

Plantilla base para aplicaciones React con TypeScript, siguiendo una arquitectura modular basada en features.

## 📚 Stack Tecnológico

### Core
- **React 19.1.1** - Librería principal para construir interfaces de usuario
- **TypeScript 5.8.3** - Tipado estático para JavaScript
- **Vite 7.1.2** - Build tool y dev server ultrarrápido

### Routing & Estado
- **React Router 7.8.2** - Navegación y routing de la aplicación
- **Zustand 5.0.8** - Gestión de estado global ligera y simple

### Estilos
- **Tailwind CSS 4.1.13** - Framework CSS utility-first

### HTTP & Datos
- **Axios 1.13.2** - Cliente HTTP para peticiones a APIs

### Desarrollo
- **ESLint 9.33.0** - Linting de código
- **TypeScript ESLint 8.39.1** - Reglas de linting para TypeScript

## 🏗️ Arquitectura

### Feature-Based Architecture

El proyecto sigue una arquitectura modular basada en features, donde cada funcionalidad está completamente autocontenida:

```
src/
├── features/              # Módulos de funcionalidad
│   ├── auth/             # Feature de autenticación
│   │   ├── services/     # Llamadas a API
│   │   ├── store/        # Estado (Zustand)
│   │   ├── types/        # TypeScript types
│   │   ├── pages/        # Páginas del feature
│   │   ├── components/   # Componentes específicos
│   │   ├── router/       # Rutas del feature
│   │   └── index.ts      # Public API del feature
│   ├── dashboard/
│   ├── admin/
│   └── customer/         # Ejemplo de feature generado
│
├── shared/               # Código compartido
│   ├── api/             # Configuración de Axios
│   ├── components/      # Componentes reutilizables
│   │   ├── ui/         # Componentes UI (NotFound, AuthLoader, etc.)
│   │   ├── layout/     # Layout components (Navbar, Sidebar, etc.)
│   │   └── guards/     # Protección de rutas (ProtectedRoute, RoleGuard, etc.)
│   └── hooks/          # Hooks compartidos
│
├── router/              # Configuración de rutas
│   ├── AppRouter.tsx   # Router wrapper
│   ├── routes.tsx      # Definición de rutas
│   └── index.ts
│
└── main.tsx            # Entry point
```

### Características Clave

**1. Separación de Responsabilidades**
- Cada feature es independiente y autocontenido
- Código compartido centralizado en `shared/`
- Rutas definidas por feature pero centralizadas en configuración

**2. Gestión de Estado con Zustand**
- Store por feature
- Persistencia automática con localStorage
- Selectores para optimización

**3. Protección de Rutas**
- Autenticación requerida
- Control por roles (admin, moderator, user)
- Control por permisos específicos
- Componentes de guard reutilizables

**4. Sistema de Autenticación**
- Token-based (localStorage)
- Verificación automática al cargar app
- Interceptors de Axios para tokens
- Redirección automática en errores 401

## 🚀 Comandos

```bash
# Desarrollo
npm run dev              # Inicia Vite dev server (puerto 5173)

# Build
npm run build            # Compila TypeScript y genera build de producción
npm run preview          # Preview del build de producción

# Linting
npm run lint             # Ejecuta ESLint

# Generación de Features
npm run create:feature <nombre>   # Genera estructura completa de un feature
```

## 🎨 Crear un Nuevo Feature

El proyecto incluye un script automatizado para generar la estructura completa de un feature:

```bash
npm run create:feature customer
```

### ¿Qué genera el script?

Este comando crea automáticamente:

```
src/features/customer/
├── services/
│   └── customer.service.ts      # Funciones para llamadas a API
│       - getAllCustomers()
│       - getCustomerById(id)
│       - createCustomer(data)
│       - updateCustomer(id, data)
│       - deleteCustomer(id)
│
├── store/
│   └── customer.store.ts        # Zustand store con:
│       - Estado (items, currentItem, isLoading, error)
│       - Acciones (fetchItems, getItem, createItem, updateItem, deleteItem)
│       - Integración con servicios
│
├── types/
│   └── customer.types.ts        # TypeScript interfaces:
│       - Customer (entidad principal)
│       - CustomerState (estado del store)
│       - CustomerActions (acciones disponibles)
│       - CustomerStore (store completo)
│
├── pages/
│   └── Customer.tsx             # Página principal del feature (vacía)
│
├── components/
│   └── .gitkeep                 # Para componentes específicos
│
├── router/
│   └── customer.routes.tsx      # Configuración de rutas:
│       - Define path '/customer'
│       - Incluye ProtectedRoute
│       - Exporta customerRoutes[]
│
└── index.ts                     # Public API:
    - Exporta store
    - Exporta types
    - Exporta páginas
    - Exporta rutas
```

### Estructura de Archivos Generados

**1. Services (`services/customer.service.ts`)**
```typescript
// Funciones individuales para cada operación
export const getAllCustomers = async (): Promise<Customer[]> => {...}
export const getCustomerById = async (id: string): Promise<Customer> => {...}
export const createCustomer = async (data): Promise<Customer> => {...}
export const updateCustomer = async (id, data): Promise<Customer> => {...}
export const deleteCustomer = async (id: string): Promise<void> => {...}
```

**2. Store (`store/customer.store.ts`)**
```typescript
// Zustand store con todo el estado y acciones
export const useCustomerStore = create<CustomerStore>((set) => ({
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,
  fetchItems: async () => {...},
  getItem: async (id) => {...},
  createItem: async (data) => {...},
  updateItem: async (id, data) => {...},
  deleteItem: async (id) => {...},
  clearError: () => {...},
}));
```

**3. Types (`types/customer.types.ts`)**
```typescript
// Interfaces completas y bien tipadas
export interface Customer {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerState {...}
export interface CustomerActions {...}
export interface CustomerStore extends CustomerState, CustomerActions {}
```

**4. Router (`router/customer.routes.tsx`)**
```typescript
// Rutas del feature con protección
export const customerRoutes: RouteObject[] = [
  {
    path: 'customer',
    element: (
      <ProtectedRoute>
        <Customer />
      </ProtectedRoute>
    ),
  },
];
```

### Pasos Después de Generar el Feature

**1. Agregar rutas al router principal**

Edita `src/router/routes.tsx`:

```typescript
import { customerRoutes } from '../features/customer';

export const router = createBrowserRouter([
  // ... otras rutas
  {
    path: "/",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      ...dashboardRoutes,
      ...adminRoutes,
      ...customerRoutes,  // ← Agregar aquí
    ],
  },
]);
```

**2. Personalizar los tipos**

Modifica `types/customer.types.ts` según tu entidad:

```typescript
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  // ... tus campos específicos
}
```

**3. Implementar la página**

Edita `pages/Customer.tsx` con tu lógica:

```typescript
import { useEffect } from 'react';
import { useCustomerStore } from '../store/customer.store';

export const Customer = () => {
  const { items, isLoading, fetchItems } = useCustomerStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      {/* Tu implementación aquí */}
    </div>
  );
};
```

**4. Usar el store en componentes**

```typescript
// Acceso directo al store
const { items, isLoading, error, fetchItems, createItem } = useCustomerStore();

// O selectores específicos para optimización
const items = useCustomerStore(state => state.items);
const isLoading = useCustomerStore(state => state.isLoading);
```

### Ventajas del Generador

✅ **Ahorro de tiempo** - Estructura completa en segundos  
✅ **Consistencia** - Todos los features siguen el mismo patrón  
✅ **Best practices** - Código siguiendo convenciones establecidas  
✅ **CRUD completo** - Operaciones básicas ya implementadas  
✅ **TypeScript completo** - Todo correctamente tipado  
✅ **Listo para usar** - Solo personalizar según necesidades

## 🔐 Sistema de Autenticación

### Roles Disponibles
- `admin` - Acceso total al sistema
- `moderator` - Permisos de moderación
- `user` - Usuario estándar
- `guest` - Usuario invitado (sin autenticar)

### Permisos
- `read:users`, `write:users`, `delete:users`
- `read:admin`, `write:admin`
- `read:reports`, `write:reports`
- `manage:roles`

### Protección de Rutas

```tsx
// Por rol
<ProtectedRoute requiredRole={UserRole.ADMIN}>
  <AdminPanel />
</ProtectedRoute>

// Por múltiples roles
<ProtectedRoute requiredRole={[UserRole.ADMIN, UserRole.MODERATOR]}>
  <Content />
</ProtectedRoute>

// Por permisos
<ProtectedRoute requiredPermissions={[Permission.READ_USERS]}>
  <UserList />
</ProtectedRoute>
```

## 📝 Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000
```

## 🎯 Principios de Diseño

1. **Modularidad** - Cada feature es independiente
2. **Escalabilidad** - Fácil agregar nuevos features
3. **Mantenibilidad** - Código organizado y predecible
4. **Type Safety** - TypeScript en todo el proyecto
5. **Developer Experience** - Herramientas para agilizar desarrollo


