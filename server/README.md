# JSON Server Mock API

Servidor de desarrollo con json-server para simular la API.

## Usuarios de Prueba

| Email | Password | Rol | Permisos |
|-------|----------|-----|----------|
| admin@micontainer.com | password123 | admin | Todos |
| mod@micontainer.com | password123 | moderator | read:users, write:users, read:reports, write:reports |
| user@micontainer.com | password123 | user | read:users |

## Endpoints Disponibles

### JSON Server REST API

**GET** `/users` - Lista todos los usuarios
**GET** `/users?email={email}` - Busca usuario por email
**GET** `/users/:id` - Obtiene un usuario específico
**POST** `/users` - Crea un nuevo usuario
**PUT** `/users/:id` - Actualiza un usuario
**DELETE** `/users/:id` - Elimina un usuario

## Autenticación

La autenticación se maneja en el **frontend**:
1. Login: `GET /users?email={email}` y valida password en el cliente
2. CheckAuth: `GET /users/:id` usando el ID del token
3. Logout: Solo limpia el localStorage (no hay endpoint)

## Comandos

```bash
# Solo el servidor mock
npm run server

# Servidor mock + Vite (en paralelo)
npm run dev:full

# Solo Vite
npm run dev
```

## Configuración

El servidor corre en `http://localhost:3000`

La variable de entorno `VITE_API_URL` debe apuntar a esta URL.
