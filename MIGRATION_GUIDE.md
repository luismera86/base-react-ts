# 🚀 Guía de Migración - Nueva Arquitectura

## ✅ Cambios Completados

Se ha refactorizado completamente el proyecto a una **arquitectura modular basada en features**.

## 📊 Antes vs Después

### Estructura Anterior
```
src/
├── components/
├── hooks/
├── pages/
├── router/
├── stores/
└── types/
```

### Nueva Estructura
```
src/
├── features/          # Módulos por dominio
│   ├── auth/
│   ├── dashboard/
│   └── admin/
├── shared/            # Código compartido
│   └── components/
│       ├── ui/
│       ├── layout/
│       └── guards/
└── config/            # Configuración
    └── router/
```

## 🔄 Cómo Actualizar los Imports

### 1. Imports de Autenticación

**Antes:**
```typescript
import { useAuth } from '../stores/authStore';
import { UserRole } from '../types/auth';
import { usePermissions } from '../hooks/useAuth';
```

**Después:**
```typescript
import { useAuth, UserRole, usePermissions } from '@/features/auth';
```

### 2. Imports de Componentes Compartidos

**Antes:**
```typescript
import { ProtectedRoute } from '../components/ProtectedRoute';
import DashboardLayout from '../components/Layout';
```

**Después:**
```typescript
import { ProtectedRoute, DashboardLayout } from '@/shared';
```

### 3. Imports del Router

**Antes:**
```typescript
import { router } from '../router/AppRouter';
```

**Después:**
```typescript
import { router } from '@/config/router';
```

## 📝 Cómo Agregar Nuevas Features

### Ejemplo: Crear Feature de "Productos"

1. **Crear estructura de carpetas:**
```bash
mkdir -p src/features/products/{components,pages,hooks,store,types,api}
```

2. **Crear tipos** (`src/features/products/types/product.types.ts`):
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface ProductState {
  products: Product[];
  isLoading: boolean;
}
```

3. **Crear store** (`src/features/products/store/product.store.ts`):
```typescript
import { create } from 'zustand';
import type { ProductState } from '../types/product.types';

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
}));
```

4. **Crear página** (`src/features/products/pages/ProductList.tsx`):
```typescript
export const ProductList = () => {
  return (
    <div>
      <h1>Lista de Productos</h1>
    </div>
  );
};
```

5. **Crear API pública** (`src/features/products/index.ts`):
```typescript
// Exportar solo lo público
export { ProductList } from './pages/ProductList';
export { useProductStore } from './store/product.store';
export type { Product } from './types/product.types';
```

6. **Agregar ruta** (`src/config/router/routes.tsx`):
```typescript
import { ProductList } from '@/features/products';

// Dentro de las rutas:
{
  path: "products",
  element: (
    <ProtectedRoute requiredRole={[UserRole.ADMIN]}>
      <ProductList />
    </ProtectedRoute>
  ),
}
```

## 🎨 Cómo Crear Componentes Compartidos

### Ejemplo: Componente Button

1. **Crear componente** (`src/shared/components/ui/Button.tsx`):
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button = ({ 
  children, 
  variant = 'primary',
  onClick 
}: ButtonProps) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

2. **Exportar** (`src/shared/components/index.ts`):
```typescript
// UI Components
export { Button } from './ui/Button';
export { AuthLoader } from './ui/AuthLoader';
// ... otros componentes
```

3. **Usar en cualquier feature**:
```typescript
import { Button } from '@/shared';

function MyComponent() {
  return (
    <Button variant="primary">
      Click me
    </Button>
  );
}
```

## 🛡️ Cómo Usar los Guards

### ProtectedRoute (Rutas)
```typescript
import { ProtectedRoute } from '@/shared';
import { UserRole, Permission } from '@/features/auth';

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

### RoleGuard (Componentes)
```typescript
import { RoleGuard } from '@/shared';
import { UserRole } from '@/features/auth';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <RoleGuard roles={UserRole.ADMIN}>
        <AdminSection />
      </RoleGuard>
      
      <RoleGuard roles={[UserRole.ADMIN, UserRole.MODERATOR]}>
        <ModeratorSection />
      </RoleGuard>
    </div>
  );
}
```

### PermissionGuard (Componentes)
```typescript
import { PermissionGuard } from '@/shared';
import { Permission } from '@/features/auth';

function UserManagement() {
  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      
      <PermissionGuard permissions={Permission.WRITE_USERS}>
        <button>Agregar Usuario</button>
      </PermissionGuard>
      
      <PermissionGuard permissions={Permission.DELETE_USERS}>
        <button>Eliminar Usuario</button>
      </PermissionGuard>
    </div>
  );
}
```

## 🎯 Hooks Disponibles

### Auth Hooks

```typescript
import { 
  useAuth,        // Estado completo de autenticación
  useUser,        // Solo el usuario
  usePermissions, // Verificar permisos
  useRole,        // Verificar roles
  useAccess       // Verificación combinada
} from '@/features/auth';

// Ejemplo: useAuth
function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated && (
        <>
          <span>{user?.name}</span>
          <button onClick={logout}>Salir</button>
        </>
      )}
    </div>
  );
}

// Ejemplo: usePermissions
function ActionButtons() {
  const { hasPermission } = usePermissions();
  
  return (
    <div>
      {hasPermission(Permission.WRITE_USERS) && (
        <button>Editar</button>
      )}
      {hasPermission(Permission.DELETE_USERS) && (
        <button>Eliminar</button>
      )}
    </div>
  );
}

// Ejemplo: useRole
function Navigation() {
  const { isAdmin, isModerator } = useRole();
  
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      {isAdmin() && <Link to="/admin">Admin</Link>}
      {isModerator() && <Link to="/moderation">Moderación</Link>}
    </nav>
  );
}
```

## 📦 Estructura de un Feature Completo

```
products/
├── api/                      # Servicios API
│   └── products.api.ts       # Llamadas HTTP
├── components/               # Componentes internos
│   ├── ProductCard.tsx
│   └── ProductForm.tsx
├── hooks/                    # Hooks específicos
│   └── useProducts.hook.ts
├── pages/                    # Páginas del feature
│   ├── ProductList.tsx
│   └── ProductDetail.tsx
├── store/                    # Estado del feature
│   └── product.store.ts
├── types/                    # Tipos del feature
│   └── product.types.ts
└── index.ts                  # API pública
```

### API pública del feature (`index.ts`):
```typescript
// Solo exporta lo que otros features necesitan
export { ProductList, ProductDetail } from './pages';
export { useProducts } from './hooks/useProducts.hook';
export type { Product, ProductFilters } from './types/product.types';

// NO exportar:
// - Componentes internos (ProductCard, ProductForm)
// - Store directamente (usar hook)
// - API calls directamente
```

## 🚦 Flujo de Datos Recomendado

1. **Componente** → llama a **Hook**
2. **Hook** → usa **Store** o **API**
3. **Store** → maneja estado
4. **API** → llamadas HTTP

```typescript
// ✅ CORRECTO
function ProductList() {
  const { products, fetchProducts } = useProducts(); // Hook
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ❌ INCORRECTO (no llamar directamente al store desde componente)
function ProductList() {
  const products = useProductStore(state => state.products); // Store directo
  // ...
}
```

## 🔍 Debugging Tips

### Ver estado de autenticación
```typescript
import { useAuth } from '@/features/auth';

function DebugAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  console.log('Auth State:', { user, isAuthenticated, isLoading });
  
  return null;
}
```

### Ver errores de compilación
```bash
# TypeScript check
npm run build

# ESLint check
npm run lint
```

## 📚 Recursos Adicionales

- Ver `ARCHITECTURE.md` para detalles completos de la arquitectura
- Cada feature debe ser auto-documentado con JSDoc
- Los componentes compartidos deben tener ejemplos de uso

## ⚠️ Mejores Prácticas

1. **No crear dependencias circulares** entre features
2. **No importar componentes internos** de otros features
3. **Usar path aliases** (`@/features`, `@/shared`)
4. **Mantener features pequeños** y enfocados
5. **Documentar la API pública** de cada feature
6. **Crear tests** para componentes compartidos
7. **Componentes atómicos** en shared, específicos en features

## 🎉 Siguiente Paso

Revisa el archivo `ARCHITECTURE.md` para una explicación completa de los principios y beneficios de esta arquitectura.

¡Tu proyecto ahora es mucho más escalable y mantenible! 🚀
