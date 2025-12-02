#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Obtener el nombre del feature desde los argumentos
const featureName = process.argv[2];

if (!featureName) {
  console.error('❌ Error: Debes proporcionar un nombre para el feature');
  console.log('\n📝 Uso: npm run create:feature <nombre>');
  console.log('Ejemplo: npm run create:feature customer\n');
  process.exit(1);
}

// Capitalizar primera letra
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const FeatureName = capitalize(featureName);

// Ruta base del feature
const featurePath = join(__dirname, '..', 'src', 'features', featureName);

console.log(`\n🚀 Creando feature: ${featureName}...\n`);

// Estructura de carpetas
const folders = [
  '',
  'services',
  'components',
  'pages',
  'router',
  'store',
  'types',
];

// Plantillas de archivos
const templates = {
  'types/{{feature}}.types.ts': `/**
 * Types para el feature ${featureName}
 */

export interface ${FeatureName} {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ${FeatureName}State {
  items: ${FeatureName}[];
  currentItem: ${FeatureName} | null;
  isLoading: boolean;
  error: string | null;
}

export interface ${FeatureName}Actions {
  fetchItems: () => Promise<void>;
  getItem: (id: string) => Promise<void>;
  createItem: (data: Omit<${FeatureName}, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, data: Partial<${FeatureName}>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearError: () => void;
}

export interface ${FeatureName}Store extends ${FeatureName}State, ${FeatureName}Actions {}
`,

  'services/{{feature}}.service.ts': `import { api } from '../../../shared/api';
import type { ${FeatureName} } from '../types/${featureName}.types';

/**
 * Obtener todos los ${featureName}s
 */
export const getAll${FeatureName}s = async (): Promise<${FeatureName}[]> => {
  const { data } = await api.get<${FeatureName}[]>('/${featureName}s');
  return data;
};

/**
 * Obtener un ${featureName} por ID
 */
export const get${FeatureName}ById = async (id: string): Promise<${FeatureName}> => {
  const { data } = await api.get<${FeatureName}>(\`/${featureName}s/\${id}\`);
  return data;
};

/**
 * Crear un nuevo ${featureName}
 */
export const create${FeatureName} = async (
  item: Omit<${FeatureName}, 'id' | 'createdAt' | 'updatedAt'>
): Promise<${FeatureName}> => {
  const { data } = await api.post<${FeatureName}>('/${featureName}s', item);
  return data;
};

/**
 * Actualizar un ${featureName}
 */
export const update${FeatureName} = async (
  id: string,
  item: Partial<${FeatureName}>
): Promise<${FeatureName}> => {
  const { data } = await api.put<${FeatureName}>(\`/${featureName}s/\${id}\`, item);
  return data;
};

/**
 * Eliminar un ${featureName}
 */
export const delete${FeatureName} = async (id: string): Promise<void> => {
  await api.delete(\`/${featureName}s/\${id}\`);
};
`,

  'store/{{feature}}.store.ts': `import { create } from 'zustand';
import type { ${FeatureName}Store } from '../types/${featureName}.types';
import * as ${featureName}Service from '../services/${featureName}.service';

export const use${FeatureName}Store = create<${FeatureName}Store>((set) => ({
  // Estado inicial
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,

  // Obtener todos los items
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await ${featureName}Service.getAll${FeatureName}s();
      set({ items, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar items',
        isLoading: false,
      });
    }
  },

  // Obtener un item específico
  getItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const item = await ${featureName}Service.get${FeatureName}ById(id);
      set({ currentItem: item, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar item',
        isLoading: false,
      });
    }
  },

  // Crear un nuevo item
  createItem: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newItem = await ${featureName}Service.create${FeatureName}(data);
      set((state) => ({
        items: [...state.items, newItem],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear item',
        isLoading: false,
      });
      throw error;
    }
  },

  // Actualizar un item
  updateItem: async (id: string, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedItem = await ${featureName}Service.update${FeatureName}(id, data);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? updatedItem : item
        ),
        currentItem: state.currentItem?.id === id ? updatedItem : state.currentItem,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar item',
        isLoading: false,
      });
      throw error;
    }
  },

  // Eliminar un item
  deleteItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await ${featureName}Service.delete${FeatureName}(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        currentItem: state.currentItem?.id === id ? null : state.currentItem,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al eliminar item',
        isLoading: false,
      });
      throw error;
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),
}));
`,

  'pages/{{Feature}}.tsx': `export const ${FeatureName} = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        ${FeatureName}
      </h1>
      <p className="text-gray-600">
        Implementa aquí la funcionalidad del feature ${featureName}.
      </p>
    </div>
  );
};
`,

  'router/{{feature}}.routes.tsx': `import type { RouteObject } from 'react-router-dom';
import { ${FeatureName} } from '../pages/${FeatureName}';
import { ProtectedRoute } from '../../../shared';

/**
 * Rutas del feature ${featureName}
 */
export const ${featureName}Routes: RouteObject[] = [
  {
    path: '${featureName}',
    element: (
      <ProtectedRoute>
        <${FeatureName} />
      </ProtectedRoute>
    ),
  },
];
`,



  'index.ts': `// Public API del feature ${FeatureName}

// Store
export { use${FeatureName}Store } from './store/${featureName}.store';

// Types
export type { ${FeatureName}, ${FeatureName}State } from './types/${featureName}.types';

// Pages
export { ${FeatureName} } from './pages/${FeatureName}';

// Router
export { ${featureName}Routes } from './router/${featureName}.routes';
`,

  'components/.gitkeep': '',
};

// Crear estructura
try {
  // Crear carpetas
  for (const folder of folders) {
    const folderPath = join(featurePath, folder);
    await mkdir(folderPath, { recursive: true });
    console.log(`✅ Carpeta creada: ${featureName}/${folder || '(root)'}`);
  }

  // Crear archivos
  for (const [templatePath, content] of Object.entries(templates)) {
    const filePath = join(
      featurePath,
      templatePath
        .replace('{{feature}}', featureName)
        .replace('{{Feature}}', FeatureName)
    );
    await writeFile(filePath, content, 'utf-8');
    console.log(`📄 Archivo creado: ${templatePath.replace('{{feature}}', featureName).replace('{{Feature}}', FeatureName)}`);
  }

  console.log(`\n✨ Feature "${featureName}" creado exitosamente!\n`);
  console.log('📋 Estructura generada:');
  console.log(`   • services/     - Llamadas a API`);
  console.log(`   • store/        - Zustand store con estado y acciones`);
  console.log(`   • types/        - TypeScript types e interfaces`);
  console.log(`   • pages/        - Componentes de página`);
  console.log(`   • components/   - Componentes del feature`);
  console.log(`   • router/       - Definición de rutas\n`);
  console.log('📋 Próximos pasos:');
  console.log(`   1. Agregar las rutas en src/config/router/routes.tsx:`);
  console.log(`      import { ${featureName}Routes } from '../../features/${featureName}';`);
  console.log(`      // Dentro de children: [...${featureName}Routes]`);
  console.log(`   2. Personalizar los tipos en types/${featureName}.types.ts`);
  console.log(`   3. Implementar la lógica en pages/${FeatureName}.tsx`);
  console.log(`   4. Usar el store directamente: use${FeatureName}Store()\n`);

} catch (error) {
  console.error('❌ Error al crear el feature:', error);
  process.exit(1);
}
