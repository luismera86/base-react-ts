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

Si la feature necesita un componente de shadcn que no está instalado aún:

1. Obtener la documentación y ejemplos antes de usarlo:
   ```bash
   npx shadcn@latest docs <componente>
   ```
2. Leer los ejemplos que devuelve el comando para entender la API correcta.
3. Instalarlo:
   ```bash
   npx shadcn@latest add <componente>
   ```
4. Leer los archivos generados para verificar qué sub-componentes exporta antes de importarlos.

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

#### Reglas críticas de shadcn/ui

Aplicar siempre al escribir JSX con componentes shadcn/ui:

**Formularios — layout de campos**

Usar `FieldGroup` + `Field` + `FieldLabel`. Nunca `div` + `Label` raw.

```tsx
// ✅ correcto
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
    <Input id="nombre" name="nombre" />
  </Field>
</FieldGroup>

// ❌ incorrecto
<div className="flex flex-col gap-1.5">
  <Label htmlFor="nombre">Nombre</Label>
  <Input id="nombre" name="nombre" />
</div>
```

Si `Field` o `FieldGroup` no están instalados: `npx shadcn@latest add @shadcn/field`.

**Formularios — estado de error**

Usar `FieldError` para mensajes de error. Nunca `<p className="text-destructive">`.

```tsx
// ✅ correcto
{
  state.error && <FieldError>{state.error}</FieldError>
}

// ❌ incorrecto
{
  state.error && <p className="text-destructive text-sm">{state.error}</p>
}
```

Para errores por campo: `data-invalid` en el `Field`, `aria-invalid` en el `Input`.

```tsx
<Field data-invalid={!!errors.email}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input aria-invalid={!!errors.email} />
  <FieldError>{errors.email}</FieldError>
</Field>
```

**Button — estado de carga**

`Button` no tiene prop `isLoading`. Componer con `Spinner` + `data-icon` + `disabled`.

```tsx
// ✅ correcto
<Button disabled={isPending}>
  {isPending && <Spinner data-icon="inline-start" />}
  Guardar
</Button>

// ❌ incorrecto
<Button disabled={isPending}>
  {isPending ? 'Guardando...' : 'Guardar'}
</Button>
```

Si `Spinner` no está instalado: `npx shadcn@latest add @shadcn/spinner`.

**Espaciado**

`gap-*` para separar elementos. Nunca `space-y-*` ni `space-x-*`.

```tsx
// ✅ correcto
<div className="flex flex-col gap-4">

// ❌ incorrecto
<div className="space-y-4">
```

**Dimensiones iguales**

`size-*` cuando ancho = alto. Nunca `w-* h-*` por separado.

```tsx
// ✅ correcto
<Avatar className="size-10">

// ❌ incorrecto
<Avatar className="w-10 h-10">
```

**Colores**

Solo tokens semánticos (`bg-primary`, `text-muted-foreground`, `text-destructive`, `bg-card`, etc.). Nunca valores crudos de Tailwind (`blue-500`, `green-600`, etc.).

**Íconos dentro de botones**

`data-icon="inline-start"` o `data-icon="inline-end"` en el ícono. Sin clases de tamaño (`size-4`, `w-4 h-4`) — el componente las gestiona.

```tsx
<Button>
  <PlusIcon data-icon="inline-start" />
  Agregar
</Button>
```

**Estados de carga con Skeleton**

Para placeholders de carga usar `Skeleton`. Nunca `animate-pulse` manual.

```tsx
// ✅ correcto
<Skeleton className="h-4 w-48" />

// ❌ incorrecto
<div className="animate-pulse bg-muted h-4 w-48 rounded" />
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
