# Arquitectura del Proyecto - Feature-Based Architecture

## 📁 Estructura de Carpetas

```
src/
├── features/                    # Módulos por dominio de negocio
│   ├── auth/                    # Feature de autenticación
│   │   ├── api/                 # Servicios API
│   │   │   └── auth.api.ts
│   │   ├── components/          # Componentes específicos
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginHeader.tsx
│   │   │   └── QuickLoginButtons.tsx
│   │   ├── hooks/               # Hooks de auth
│   │   │   └── useAuth.hook.ts
│   │   ├── pages/               # Páginas de auth
│   │   │   └── LoginPage.tsx
│   │   ├── store/               # Estado de auth
│   │   │   └── auth.store.ts
│   │   ├── types/               # Tipos de auth
│   │   │   └── auth.types.ts
│   │   └── index.ts             # API pública del feature
│   │
│   ├── dashboard/               # Feature de dashboard
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── UserDashboard.tsx
│   │   └── index.ts
│   │
│   └── admin/                   # Feature de administración
│       ├── pages/
│       │   └── AdminPanel.tsx
│       └── index.ts
│
├── shared/                      # Código compartido entre features
│   ├── components/              # Componentes reutilizables
│   │   ├── ui/                  # Componentes UI básicos
│   │   │   ├── AuthLoader.tsx
│   │   │   └── AccessDenied.tsx
│   │   ├── layout/              # Componentes de layout
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── UserInfo.tsx
│   │   │   ├── MobileMenuButton.tsx
│   │   │   └── SidebarLink.tsx
│   │   ├── guards/              # Route guards
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── RoleGuard.tsx
│   │   │   └── PermissionGuard.tsx
│   │   └── index.ts
│   ├── hooks/                   # Hooks genéricos
│   ├── utils/                   # Utilidades
│   ├── types/                   # Tipos compartidos
│   └── index.ts
│
├── config/                      # Configuración
│   └── router/                  # Router configuration
│       ├── routes.tsx
│       └── index.ts
│
├── components/                  # Componentes legacy (migrar)
│   └── AppWrapper.tsx
│
├── App.tsx
└── main.tsx
```

## 🏗️ Principios de Arquitectura

### 1. **Feature-Based Organization**
Cada feature es un módulo auto-contenido con:
- Su propio estado (store)
- Sus propios componentes
- Sus propias páginas
- Sus propios hooks
- Sus propios tipos
- Su propia API

### 2. **Encapsulación**
- Cada feature exporta solo lo necesario a través de `index.ts`
- Los detalles de implementación permanecen privados
- Comunicación entre features a través de APIs públicas

### 3. **Separación de Responsabilidades**
- **Features**: Lógica de negocio específica
- **Shared**: Componentes y utilidades reutilizables
- **Config**: Configuración de la aplicación

### 4. **Escalabilidad**
- Fácil agregar nuevos features sin afectar existentes
- Componentes atómicos y reutilizables
- Imports claros y mantenibles

## 📦 Features

### Auth Feature
**Responsabilidad**: Todo lo relacionado con autenticación y autorización

**Exportaciones públicas**:
```typescript
// Hooks
useAuth, useUser, usePermissions, useRole, useAccess, useRouteAccess

// Tipos
User, UserRole, Permission, AuthState

// Páginas
LoginPage
```

**Uso**:
```typescript
import { useAuth, UserRole } from '@/features/auth';
```

### Dashboard Feature
**Responsabilidad**: Dashboard de usuario

**Exportaciones públicas**:
```typescript
// Páginas
UserDashboard
```

### Admin Feature
**Responsabilidad**: Panel de administración

**Exportaciones públicas**:
```typescript
// Páginas
AdminPanel
```

## 🔧 Shared Module

### Components
#### UI Components
- `AuthLoader`: Spinner de carga para autenticación
- `AccessDenied`: Pantalla de acceso denegado

#### Layout Components
- `DashboardLayout`: Layout principal con navbar, sidebar y footer
- `Navbar`: Barra de navegación superior
- `Sidebar`: Menú lateral
- `Footer`: Pie de página
- `Logo`: Logo de la aplicación
- `UserInfo`: Información del usuario en navbar
- `MobileMenuButton`: Botón de menú móvil
- `SidebarLink`: Link individual del sidebar

#### Guards
- `ProtectedRoute`: Proteger rutas por autenticación/roles/permisos
- `RoleGuard`: Mostrar/ocultar contenido por rol
- `PermissionGuard`: Mostrar/ocultar contenido por permiso

**Uso**:
```typescript
import { ProtectedRoute, DashboardLayout } from '@/shared';
```

## 🛣️ Router Configuration

El router está centralizado en `config/router/routes.tsx`:

```typescript
import { UserRole, Permission } from '@/features/auth';
import { ProtectedRoute } from '@/shared';

// Ejemplo de ruta protegida
{
  path: "admin",
  element: (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <AdminPanel />
    </ProtectedRoute>
  ),
}
```

## 🎯 Beneficios de esta Arquitectura

### ✅ Escalabilidad
- Agregar nuevos features es simple: crear carpeta en `features/`
- No hay acoplamiento entre features
- Fácil dividir en microfrontends si es necesario

### ✅ Mantenibilidad
- Todo relacionado a un feature está en un solo lugar
- Cambios en un feature no afectan otros
- Fácil encontrar y modificar código

### ✅ Testabilidad
- Cada feature puede testearse independientemente
- Componentes atómicos son fáciles de testear
- Mock de dependencies es directo

### ✅ Colaboración
- Equipos pueden trabajar en features diferentes sin conflictos
- Ownership claro de cada módulo
- Code reviews más enfocados

### ✅ Reutilización
- Componentes en `shared/` disponibles para todos
- Evita duplicación de código
- Consistencia en UI

## 📝 Guía de Uso

### Agregar un Nuevo Feature

1. Crear carpeta en `features/`:
```bash
mkdir -p src/features/nuevo-feature/{components,pages,hooks,store,types,api}
```

2. Crear estructura interna:
```typescript
// src/features/nuevo-feature/index.ts
export { NuevaPagina } from './pages/NuevaPagina';
export { useNuevoHook } from './hooks/useNuevoHook';
```

3. Usar en router:
```typescript
import { NuevaPagina } from '@/features/nuevo-feature';
```

### Crear Componente Compartido

1. Decidir categoría: `ui`, `layout`, o `guards`
2. Crear componente en carpeta correspondiente
3. Exportar en `shared/components/index.ts`
4. Usar desde cualquier feature

### Agregar Nueva Ruta

1. Editar `config/router/routes.tsx`
2. Agregar ruta con protección apropiada
3. Importar página desde feature correspondiente

## 🔄 Migración desde Arquitectura Anterior

### Archivos Migrados

| Anterior | Nuevo |
|----------|-------|
| `src/types/auth.ts` | `src/features/auth/types/auth.types.ts` |
| `src/stores/authStore.ts` | `src/features/auth/store/auth.store.ts` |
| `src/hooks/useAuth.ts` | `src/features/auth/hooks/useAuth.hook.ts` |
| `src/pages/Login.tsx` | `src/features/auth/pages/LoginPage.tsx` |
| `src/components/ProtectedRoute.tsx` | `src/shared/components/guards/ProtectedRoute.tsx` |
| `src/components/Layout.tsx` | `src/shared/components/layout/DashboardLayout.tsx` |
| `src/router/AppRouter.tsx` | `src/config/router/routes.tsx` |

### Actualizar Imports

Buscar y reemplazar:
```typescript
// Antes
import { useAuth } from '../stores/authStore';

// Después
import { useAuth } from '@/features/auth';
```

## 🚀 Próximos Pasos

- [ ] Configurar path aliases en `tsconfig.json` (`@/features`, `@/shared`, etc.)
- [ ] Agregar tests unitarios por feature
- [ ] Implementar lazy loading de features
- [ ] Agregar Storybook para componentes compartidos
- [ ] Documentar API de cada feature con JSDoc
- [ ] Implementar error boundaries por feature
