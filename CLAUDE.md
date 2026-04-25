# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar en este repositorio.

## Idioma

Responde siempre en español, tanto en explicaciones como en comentarios de código y mensajes de commit.

## Comandos

```bash
npm run dev              # Servidor de desarrollo (Vite HMR)
npm run build            # Verificación de tipos y bundle (tsc -b && vite build)
npm run lint             # ESLint
npm run format           # Prettier — formatea y escribe todos los archivos
npm run format:check     # Prettier — solo verifica sin escribir (útil en CI)
npm run preview          # Vista previa del build de producción
npm run create:feature   # Scaffold de una nueva feature (node scripts/create-feature.js)
```

No hay test runner configurado.

## Stack

React 19 · TypeScript 5.8 · Vite 7 · Tailwind CSS v4 (via `@tailwindcss/vite`) · shadcn/ui (estilo `base-nova`, color base `neutral`) · @base-ui/react · Zustand 5 · React Router v7 · Axios

El alias `@/` apunta a `src/`.

Formato: Prettier con `prettier-plugin-tailwindcss` (ordena clases automáticamente). Config en `prettier.config.js`: sin semicolons, single quotes, trailing comma ES5, print width 100. ESLint y Prettier están integrados via `eslint-config-prettier` — sin conflictos entre reglas.

## Reglas de código

### React 19 — hooks y patrones preferidos

Usar los hooks nuevos de React 19 en lugar de `useEffect` siempre que sea posible:

| Caso de uso                       | Hook preferido   | En lugar de                   |
| --------------------------------- | ---------------- | ----------------------------- |
| Peticiones async / promesas       | `use(promise)`   | `useEffect` + `useState`      |
| Acciones de formulario con estado | `useActionState` | `useEffect` + `useState`      |
| Estado pendiente de un form padre | `useFormStatus`  | prop drilling + `useState`    |
| Actualizaciones optimistas        | `useOptimistic`  | `useEffect` + rollback manual |
| Marcar transición no urgente      | `useTransition`  | `useEffect` + flag de loading |

`useEffect` solo está justificado para sincronizar con sistemas externos (suscripciones, eventos del DOM, librerías de terceros) o para lógica de inicialización que no encaje en ninguno de los hooks anteriores. Si se usa, documentar brevemente por qué no hay alternativa.

### Validaciones de formularios

Las validaciones del frontend deben ser un espejo exacto de las del backend: mismas reglas, mismos límites, mismos mensajes de error. Nunca relajar ni inventar restricciones en el cliente. Si el backend cambia sus validaciones, el formulario debe actualizarse en el mismo PR.

### shadcn/ui

Componentes en `src/components/ui/`. Para agregar uno nuevo:

```bash
npx shadcn@latest add <componente>
```

No usar colores hardcodeados de Tailwind (`blue-500`, etc.) — usar los tokens semánticos definidos en `src/index.css` (`primary`, `muted`, `destructive`, etc.).

### Fragmentación de componentes

Ningún componente debe crecer hasta ser difícil de leer. Reglas concretas:

- Una página (`pages/`) solo orquesta — importa secciones y les pasa datos. No contiene JSX de detalle.
- Extraer a `components/` de la feature todo bloque que tenga lógica propia, se repita más de una vez, o supere ~80 líneas de JSX.
- Nombrar los fragmentos por su responsabilidad visual, no por su posición (`ProductForm`, `OrderSummaryCard`, no `TopSection` ni `RightPanel`).
- Si un componente necesita más de 3-4 props para funcionar, evaluar si debería leer el store directamente o si conviene dividirlo más.

### Reutilización de componentes y consistencia visual

Antes de crear cualquier componente nuevo, revisar en este orden:

1. `src/components/ui/` — componentes de shadcn ya instalados
2. `src/shared/components/ui/` — componentes genéricos propios
3. `src/shared/components/layout/` — piezas del layout
4. `src/shared/components/guards/` — guards de acceso

Si el componente que se necesita ya existe o es muy similar a uno existente, reutilizarlo o extenderlo — nunca duplicarlo.

Todas las páginas protegidas se renderizan dentro del layout principal via `<Outlet />`. No crear layouts alternativos ni envolver páginas con su propio navbar/sidebar.

## Arquitectura

### Estructura base

```
src/
├── features/       # Módulos de negocio, cada uno autocontenido
├── shared/         # Código transversal reutilizable
│   ├── api/        # Cliente axios y configuración base
│   ├── components/ # Guards, layout, UI genérica
│   └── index.ts
├── components/ui/  # Componentes generados por shadcn
├── lib/            # Utilidades (cn, etc.)
├── router/         # Router principal y composición de rutas
├── App.tsx         # Punto de entrada de la aplicación
└── main.tsx        # Montaje del árbol React
```

### Estructura de una feature

Cada feature en `src/features/<nombre>/` contiene:

- `pages/` — componentes de página (solo orquestan, sin JSX de detalle)
- `components/` — componentes propios de la feature
- `hooks/` — hooks específicos
- `services/` — llamadas a la API
- `store/` — estado Zustand si aplica
- `types/` — tipos TypeScript
- `router/<nombre>.routes.tsx` — rutas exportadas
- `index.ts` — barrel export

### Sistema de rutas

El router vive en `src/router/`:

- `routes.tsx` — define y compone todas las rutas
- `AppRouter.tsx` — componente raíz; monta `RouterProvider` y llama `checkAuth()` al iniciar
- `index.ts` — barrel export

**Estructura de dos niveles:**

```
createBrowserRouter([
  ...authRoutes,           // Rutas públicas (sin layout, sin auth)
  {
    path: "/",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      ...nombreFeatureRoutes,
    ],
  },
  { path: "*", element: <NotFound /> },  // Siempre al final
])
```

**Reglas:**

- Rutas **públicas** (login, etc.) van en el spread del nivel raíz, fuera del layout.
- Rutas **protegidas** van en `children`. El `ProtectedRoute` del layout cubre autenticación para todas.
- El `ProtectedRoute` dentro de cada feature es solo para restricciones de **rol o permiso**.
- La ruta `path: "*"` debe ser siempre el último elemento del array.

### API

El cliente HTTP va en `src/shared/api/axios.config.ts` (instancia `api`). Lee la URL base de `VITE_API_URL` (fallback: `/api`). Incluye interceptores para:

- **Request**: inyectar el token desde `localStorage`
- **Response**: redirigir a `/login` en 401 y normalizar mensajes de error

### Protección de rutas

`ProtectedRoute`, `RoleGuard` y `PermissionGuard` van en `src/shared/components/guards/`. Soportan:

- `requiredRole`: `UserRole` o `UserRole[]` (OR por defecto, `requireAllRoles` para AND)
- `requiredPermissions`: `Permission[]` (requiere todos por defecto)
- `fallback`: JSX personalizado en lugar del `AccessDenied` por defecto

Jerarquía de roles: `guest (0) < user (1) < moderator (2) < admin (3)`.
