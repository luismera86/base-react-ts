# Release — lint, build, versión, tag y push

Analiza los cambios pendientes, determina el tipo de versión, construye el proyecto, hace commit, versiona con tag y pushea.

## Pasos a seguir en orden

### 1. Verificar estado del repo

```bash
git status
git diff HEAD
```

- Si no hay cambios staged ni unstaged, informar al usuario y detener.

### 2. Analizar los cambios para determinar el tipo de versión

Revisar el diff completo (`git diff HEAD` y `git diff --cached`) y clasificar:

| Tipo      | Cuándo aplicar                                                                                                                                                                                            |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **major** | Cambios que rompen la experiencia existente: rutas eliminadas o renombradas, cambios en props públicas de componentes compartidos, migración de design system o dependencias mayores con breaking changes |
| **minor** | Features nuevas sin romper lo existente: nuevas páginas, nuevas features, nuevos componentes reutilizables, nuevas rutas                                                                                  |
| **patch** | Fixes de UI, ajustes de estilos, refactors internos, corrección de tipos, actualizaciones de dependencias, docs                                                                                           |

Informar al usuario qué tipo detectaste y el motivo **antes de continuar**. Pedir confirmación o corrección.

### 3. Ejecutar format, lint y build

```bash
npm run format
npm run lint
npm run build
```

- `format` aplica Prettier (con `prettier-plugin-tailwindcss` para ordenar clases) y escribe los cambios directamente.
- `lint` ejecuta ESLint. Si falla, mostrar el error, detener y **no continuar**.
- `build` incluye verificación de tipos TypeScript (`tsc -b`) además del bundle de Vite. Si falla, mostrar el error, detener y **no continuar**.

### 4. Verificar tests (opcional)

```bash
find . -name "*.spec.ts" -o -name "*.test.ts" -o -name "*.spec.tsx" -o -name "*.test.tsx" | grep -v node_modules | grep -v dist | head -5
```

- Si **no se encuentran archivos de test**, omitir este paso y continuar.
- Si **sí existen tests**, preguntar al usuario: _"Se encontraron tests en el proyecto. ¿Deseas ejecutarlos antes del release? (s/n)"_
  - Si responde **sí**: ejecutar `npm test`. Si fallan, detener y **no continuar**.
  - Si responde **no**: omitir y continuar.

### 5. Hacer commit de los cambios pendientes

Stagear los archivos relevantes (sin incluir `.env`, archivos de secretos ni binarios grandes):

```bash
git add <archivos-relevantes>
```

Redactar el mensaje de commit en español usando el formato:

```
<tipo>: <descripción corta>

<detalle opcional si aplica>
```

Donde `<tipo>` es: `feat`, `fix`, `refactor`, `chore`, `docs`, `style` según el cambio.

### 6. Versionar con npm version

Según el tipo determinado en el paso 2:

```bash
npm version patch   # fixes / refactors / estilos
npm version minor   # nuevas features o páginas
npm version major   # breaking changes
```

Esto actualiza `package.json`, crea el commit de versión y el tag automáticamente.

### 7. Push del commit y del tag

```bash
git push && git push --tags
```

### 8. Crear GitHub Release con notas de cambios

Obtener los commits desde el tag anterior:

```bash
git log <tag-anterior>..HEAD --pretty=format:"- %s" --no-merges
```

Agrupar por tipo (`feat`, `fix`, `chore`, `style`, etc.) y crear el release. **Las notas siempre en español.**

```bash
gh release create <tag> --title "<tag>" --notes "<notas-de-cambios>"
```

- Si el remote no es GitHub o `gh` no está disponible, omitir e informar al usuario.
- Para releases `major`, agregar `--latest` explícitamente.

### 9. Confirmar al usuario

Mostrar:

- Versión anterior → versión nueva
- Nombre del tag creado (ej. `v1.2.3`)
- URL del GitHub Release creado
