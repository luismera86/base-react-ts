# Crear nueva feature

Crea una nueva feature completa siguiendo la arquitectura y reglas del proyecto.

## Argumentos

`$ARGUMENTS` contiene el nombre de la feature en kebab-case (ej: `productos`, `ordenes`, `clientes`).

Si `$ARGUMENTS` está vacío, pregunta al usuario el nombre antes de continuar.

## Pasos

### 1. Scaffold inicial

Ejecuta el script de scaffold:

```bash
npm run create:feature $ARGUMENTS
```

Esto genera la estructura base en `src/features/$ARGUMENTS/`.

### 2. Registrar las rutas

Abre `src/router/routes.tsx` y:

1. Importa las rutas de la nueva feature: `import { $ARGUMENTSRoutes } from '../features/$ARGUMENTS';`
2. Agrega el spread dentro del `children` del layout protegido (junto a `dashboardRoutes` y `adminRoutes`), **antes** de la ruta `path: "*"`.

Las rutas de la feature solo deben incluir `ProtectedRoute` con `requiredRole` o `requiredPermissions` si la ruta tiene restricciones de acceso — la autenticación base ya la gestiona el `ProtectedRoute` del layout padre.

### 3. Adaptar el store a React 19

El store generado usa `try/catch` con `set({ isLoading })` directamente. Revisa si alguna acción puede beneficiarse de `useTransition` o `useOptimistic` en el componente que lo consuma. El store en sí puede quedarse igual — las reglas de React 19 aplican a los **componentes**, no al store de Zustand.

### 4. Auditoría de componentes existentes

Antes de escribir cualquier JSX en la nueva feature, revisar qué hay disponible:

1. Listar los componentes de shadcn ya instalados en `src/components/ui/`
2. Listar los componentes en `src/shared/components/ui/` (genéricos propios)
3. Revisar `src/shared/components/layout/` para entender las piezas del layout disponibles
4. Revisar `src/shared/components/guards/` para los guards de acceso

Con esa lista en mano, identificar qué piezas de la nueva feature pueden cubrirse con componentes existentes y cuáles realmente requieren algo nuevo. Nunca crear un componente que duplique uno ya existente.

Si la feature necesita un componente de shadcn que no está instalado aún, instalarlo:

```bash
npx shadcn@latest add <componente>
```

### 5. Planificar la fragmentación antes de escribir código

Antes de implementar la página, identificar sus bloques visuales y definir qué va en cada archivo:

- La página (`pages/<Feature>.tsx`) solo ensambla secciones: importa componentes y les pasa datos. No escribe JSX de detalle.
- Cada sección significativa va en `components/` de la feature con nombre que describa su responsabilidad (`<Feature>Form`, `<Feature>Table`, `<Feature>DetailCard`, etc.).
- Si un bloque tiene su propio estado o lógica de interacción, es un componente separado.
- Si un componente necesita más de 3-4 props, considerar si puede leer el store directamente o si conviene dividirlo.

Documentar brevemente (en el chat, no en el código) qué componentes se van a crear y qué hace cada uno antes de empezar. Esperar confirmación del usuario si la estructura no es obvia.

### 6. Verificar el layout

Confirmar que las páginas de la nueva feature se renderizan dentro de `DashboardLayout` (a través de `<Outlet />`). Las rutas de la feature deben agregarse en el `children` del layout protegido en `src/router/routes.tsx` — no crear un layout propio ni envolver la página con navbar o sidebar adicionales.

Si la feature necesita una disposición visual diferente a la estándar, extender los subcomponentes en `src/shared/components/layout/` en lugar de crear un layout paralelo.

### 7. Adaptar la página principal

Reemplaza el contenido placeholder de `pages/<Feature>.tsx` con una estructura real que incluya:

- Si lista datos: usa `useActionState` o `use(promise)` en lugar de `useEffect` + fetch manual.
- Si tiene formulario: usa `useActionState` para manejar el estado del envío.
- Componentes de shadcn/ui para la UI (`Card`, `Button`, `Table`, `Input`, etc.) con tokens semánticos — nunca colores hardcodeados como `blue-500`.

Ejemplo de página con listado usando React 19:

```tsx
import { use } from 'react'
import { useFeatureStore } from '../store/feature.store'

// Separar la promesa del render
const dataPromise = featureService.getAll()

export const FeaturePage = () => {
  const data = use(dataPromise)
  // ...
}
```

Para formularios, preferir `useActionState`:

```tsx
const [state, action, isPending] = useActionState(async (_prev, formData) => {
  // lógica de submit
}, null)
```

### 8. Validaciones del formulario

Si la feature tiene formularios, las validaciones del cliente deben ser espejo exacto de las del backend (mismas reglas, mismos límites, mismos mensajes). Preguntar al usuario qué validaciones requiere el backend antes de implementarlas.

### 9. Tipos

Revisa `types/<feature>.types.ts` y ajusta las interfaces a los campos reales del modelo. Elimina los campos placeholder (`name`, `createdAt`, etc.) que no correspondan.

### 10. Servicios

Verifica que los endpoints en `services/<feature>.service.ts` coincidan con los reales del backend. Los métodos generados usan `/<feature>s` como base — ajustar si el backend usa una ruta diferente.

### 11. Barrel export

Confirma que `index.ts` exporta todo lo que otros módulos necesitarán. No exportar componentes internos que no sean consumidos fuera de la feature.

### 12. Resumen final

Al terminar, muestra al usuario:

- Archivos creados y modificados
- Ruta registrada en el router
- Próximos pasos pendientes (tipos a ajustar, endpoints a confirmar, validaciones del backend)
