# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar en este repositorio.

## Idioma

Responde siempre en español, tanto en explicaciones como en comentarios de código y mensajes de commit.

## Comandos

```bash
npm run dev              # Servidor de desarrollo (Vite HMR)
npm run build            # Verificación de tipos y bundle (tsc -b && vite build)
npm run lint             # ESLint
npm run preview          # Vista previa del build de producción
npm run create:feature   # Scaffold de una nueva feature (node scripts/create-feature.js)
```

No hay test runner configurado.

## Stack

React 19 · TypeScript 5.8 · Vite 7 · Tailwind CSS v4 (via `@tailwindcss/vite`) · shadcn/ui (estilo `base-nova`, color base `neutral`) · @base-ui/react · Zustand 5 · React Router v7 · Axios

El alias `@/` apunta a `src/`.

## Reglas de código

### React 19 — hooks y patrones preferidos

Usar los hooks nuevos de React 19 en lugar de `useEffect` siempre que sea posible:

| Caso de uso | Hook preferido | En lugar de |
|---|---|---|
| Peticiones async / promesas | `use(promise)` | `useEffect` + `useState` |
| Acciones de formulario con estado | `useActionState` | `useEffect` + `useState` |
| Estado pendiente de un form padre | `useFormStatus` | prop drilling + `useState` |
| Actualizaciones optimistas | `useOptimistic` | `useEffect` + rollback manual |
| Marcar transición no urgente | `useTransition` | `useEffect` + flag de loading |

`useEffect` solo está justificado para sincronizar con sistemas externos (suscripciones, eventos del DOM, librerías de terceros) o para lógica de inicialización que no encaje en ninguno de los hooks anteriores. Si se usa, documentar brevemente por qué no hay alternativa.

### Validaciones de formularios

Las validaciones del frontend deben ser un espejo exacto de las del backend: mismas reglas, mismos límites, mismos mensajes de error. Nunca relajar ni inventar restricciones en el cliente. Si el backend cambia sus validaciones, el formulario debe actualizarse en el mismo PR.

### shadcn/ui

Componentes en `src/components/ui/`. Para agregar uno nuevo:
```bash
npx shadcn@latest add <componente>
```

No usar colores hardcodeados de Tailwind (`blue-500`, etc.) — usar los tokens semánticos definidos en `src/index.css` (`primary`, `muted`, `destructive`, etc.).

## Arquitectura

### Estructura de carpetas

```
src/
├── features/       # Módulos de negocio, cada uno autocontenido
│   ├── auth/
│   ├── admin/
│   └── dashboard/
├── shared/         # Código transversal reutilizable
│   ├── api/        # Cliente axios y configuración base
│   ├── components/ # Guards, layout, UI genérica
│   └── index.ts
├── components/ui/  # Componentes generados por shadcn
├── lib/            # Utilidades (cn, etc.)
└── router/         # Router principal y composición de rutas
```

### Estructura de una feature

Cada feature en `src/features/<nombre>/` contiene:
- `pages/` — componentes de página
- `components/` — componentes propios de la feature
- `hooks/` — hooks específicos
- `services/` — llamadas a la API
- `store/` — estado Zustand si aplica
- `types/` — tipos TypeScript
- `router/<nombre>.routes.tsx` — rutas exportadas
- `index.ts` — barrel export

Las rutas de cada feature se importan en `src/router/routes.tsx` y se componen en el router principal.

### API y autenticación

El cliente HTTP está en `src/shared/api/axios.config.ts` (instancia `api`). Lee la URL base de `VITE_API_URL` (fallback: `/api`). Incluye interceptores para:
- **Request**: inyecta el token desde `localStorage`
- **Response**: redirige a `/login` en 401 y normaliza mensajes de error

El store de auth (`src/features/auth/store/auth.store.ts`) usa Zustand con `persist` (clave `auth-storage`, serializa `user`, `token`, `isAuthenticated`). Los servicios de auth llaman a endpoints reales: `POST /auth/login`, `GET /auth/check`, `POST /auth/logout`.

### Protección de rutas

`ProtectedRoute` y los guards `RoleGuard` / `PermissionGuard` están en `src/shared/components/guards/`. Soportan:
- `requiredRole`: `UserRole` o `UserRole[]` (OR por defecto, `requireAllRoles` para AND)
- `requiredPermissions`: `Permission[]` (requiere todos por defecto)
- `fallback`: JSX personalizado en lugar del `AccessDenied` por defecto

Jerarquía de roles: `guest (0) < user (1) < moderator (2) < admin (3)`. `hasRoleOrHigher` aplica esta jerarquía.

### Layout

`DashboardLayout` en `src/shared/components/layout/` está descompuesto en: `Navbar`, `Sidebar`, `SidebarLink`, `UserInfo`, `Logo`, `MobileMenuButton`, `Footer`. El contenido de página se renderiza via `<Outlet />`.
