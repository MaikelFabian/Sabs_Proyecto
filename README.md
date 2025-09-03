
# SABS Backend (NestJS) — Guía de instalación y uso

Este proyecto es una API backend construida con NestJS, que utiliza autenticación con JWT vía cookie HttpOnly y PostgreSQL como base de datos. Incluye seeders automáticos para módulos, opciones y permisos.

## Requisitos

- Node.js (versión LTS recomendada)
- npm (incluido con Node.js)
- Docker Desktop (para Windows)
- Git (opcional si prefieres clonar el repositorio)

## 1) Clonar o descargar el proyecto

Opción A — Clonar con Git:
```powershell
git clone https://github.com/MaikelFabian/Sabs_Proyecto.git
```

Entrar al directorio del proyecto:
```powershell
cd Sabs_Proyecto
```

Opción B — Descargar ZIP desde tu proveedor de repositorios (GitHub/GitLab/Bitbucket), extraer y abrir la carpeta en tu IDE.

## 2) Variables de entorno

El backend usa variables de entorno para configuraciones como el puerto y el secreto JWT.

- JWT_SECRET: secreto para firmar los tokens (por defecto usa "Sabs" si no se define).
- PORT: puerto del servidor (por defecto 3000).
- Parámetros de base de datos: si tu configuración de TypeORM lee variables de entorno, ajusta host/puerto/usuario/contraseña y nombre de la base.

Ejemplo (si decides crear un archivo `.env` en la raíz):

Nota:
- El secreto JWT también puede definirse desde el sistema. Si no estableces JWT_SECRET, la app usará "Sabs" por defecto.
- El backend expone CORS para http://localhost:5173 con credenciales habilitadas (cookies), ideal si usas un frontend en Vite.

## 3) Base de datos con Docker (PostgreSQL)

El proyecto incluye un docker-compose.yml para levantar PostgreSQL.

Arrancar la base de datos:
```powershell
docker compose up -d
```

Ver logs de la base de datos:
```powershell
docker compose logs -f db
```

Apagar contenedores:
```powershell
docker compose down
```

Volumen de datos:
- La configuración monta un volumen para persistencia, por lo que tus datos permanecen entre reinicios de contenedores.

¿La base de datos se crea automáticamente?
- Sí, el contenedor de PostgreSQL crea la base definida en `docker-compose.yml` (usuario, contraseña y base por variables de entorno).
- Las tablas se crean/actualizan por TypeORM según tu configuración (p. ej., `synchronize: true` o migraciones). En este proyecto, además se ejecutan seeders al arrancar (módulos, opciones y permisos).

## 4) Instalar dependencias

Instalar dependencias del backend:
```powershell
npm install
```

## 5) Arrancar el backend

Desarrollo (watch mode):
```powershell
npm run start:dev
```

Producción (build + run):
```powershell
npm run build
```

Iniciar servidor con el build:
```powershell
npm run start:prod
```

Por defecto, el backend escucha en:
- http://localhost:3000 (o el valor de `PORT` en tu .env)

CORS:
- Habilitado para http://localhost:5173 con `credentials: true` (si usas un frontend local, recuerda enviar cookies).

## 6) Autenticación (cookies HttpOnly)

Este backend usa JWT enviado en una cookie HttpOnly llamada `access_token`.

- Inicio de sesión
  - Endpoint: POST /auth/login
  - Body esperado:
    ```json
    {
      "correo": "admin@gmail.com",
      "contrasena": "LOUR1234"
    }
    ```
  - Respuesta: datos del usuario y se establece la cookie `access_token` (HttpOnly, `sameSite: 'lax'`, `secure: false` en desarrollo).

- Perfil actual (requiere cookie válida)
  - Endpoint: GET /auth/me

- Cerrar sesión
  - Endpoint: POST /auth/logout
  - Efecto: limpia la cookie `access_token`.

Importante para frontends:
- Debes enviar credenciales (cookies) en cada request.
- En axios, por ejemplo, usa `withCredentials: true`.

## 7) Notificaciones y permisos

Endpoints de notificaciones están protegidos por:
- JwtAuthGuard (requiere cookie `access_token` válida).
- PermisosGuard (requiere permisos asociados a la ruta).

Permiso requerido:
- Tras el ajuste reciente, los endpoints clave de notificaciones usan el permiso:
  - `VER_VERNOTIFICACIONES`
- Asegúrate de que el rol del usuario tenga asignado este permiso. Los seeders generan permisos a partir de las opciones y, en el caso de “Ver Notificaciones”, el código normalizado resultante es `VER_VERNOTIFICACIONES`.

Si recibes 403:
- Verifica que el usuario haya iniciado sesión (cookie presente).
- Verifica que la ruta tenga el permiso correcto y que tu rol lo tenga asignado (`VER_VERNOTIFICACIONES`).
- Revisa que el frontend esté enviando cookies (withCredentials) y que el origen CORS coincida (http://localhost:5173).

## 8) Semillas (seeders)

Al iniciar la aplicación se ejecutan seeders que:
- Crean módulos (por ejemplo, “Notificaciones”).
- Crean opciones (p. ej., “Ver Notificaciones”, “Gestionar Notificaciones”).
- Generan permisos a partir de las opciones (p. ej., `VER_VERNOTIFICACIONES`, etc.).

Esto permite empezar con una base de permisos/opciones consistente para probar el flujo completo.

## 9) Comandos útiles

Instalar dependencias:
```powershell
npm install
```

Arrancar en desarrollo:
```powershell
npm run start:dev
```

Compilar para producción:
```powershell
npm run build
```

Arrancar en producción:
```powershell
npm run start:prod
```

Levantar base de datos en Docker:
```powershell
docker compose up -d
```

Apagar contenedores:
```powershell
docker compose down
```

## 10) Solución de problemas

- 401 (Unauthorized):
  - La cookie `access_token` no está presente o expiró. Inicia sesión de nuevo en /auth/login.

- 403 (Forbidden):
  - Problema de permisos. Confirma que el rol del usuario tiene el permiso requerido (p. ej., `VER_VERNOTIFICACIONES` para notificaciones).
  - Revisa que PermisosGuard mapea correctamente el permiso para la ruta solicitada.

- Cookies no viajan al backend:
  - Asegúrate de que el cliente envíe `withCredentials: true`.
  - Verifica que CORS permita el origen (por defecto http://localhost:5173) y que `credentials` esté habilitado.
  - En desarrollo, `secure: false` y `sameSite: 'lax'` están configurados en las cookies.

- Conexión a base de datos:
  - Verifica que el contenedor de PostgreSQL esté arriba (`docker compose up -d`).
  - Confirma host/puerto/usuario/contraseña en tu configuración de TypeORM.
  - Revisa logs: `docker compose logs -f db`.

## 11) Estructura (resumen)

- Autenticación
  - Controlador: `src/auth/auth.controller.ts`
  - Estrategias: `src/auth/local.strategy.ts` (campos: correo, contrasena), `src/auth/jwt.strategy.ts` (extrae JWT desde cookie `access_token`).
- Guards
  - JWT: protege endpoints autenticados.
  - Permisos: valida que el usuario tenga permiso para la ruta.
- Notificaciones
  - Controlador con endpoints protegidos (requieren `VER_VERNOTIFICACIONES` tras la corrección).

---
