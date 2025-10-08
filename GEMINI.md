# Gemini Context for rag_maillist

## 1. Resumen del Proyecto (Project Overview)

Este es una aplicación full-stack para gestionar el apadrinamiento de perros.

- El **backend** es una API de Node.js con Express que se conecta a una base de datos MySQL para gestionar datos de padrinos y perros. También se integra con PayPal y Wordpress.
- El **frontend** es una aplicación React (creada con Vite) que permite a los usuarios ver los perros y su estado de apadrinamiento. La UI se construye con Material UI (MUI).

## 2. Stack Tecnológico (Technology Stack)

- **Gestor de Paquetes (Package Manager)**: `pnpm`. **Siempre se debe usar `pnpm`** para todas las operaciones con paquetes.
- **Versión de Node.js**: `v22` o superior.
- **Frontend**:
  - Framework: `React v19+`
  - Bundler: `Vite`
  - Librería UI: `Material UI (MUI) v7+`. Dar preferencia siempre a componentes y soluciones de MUI.
  - Iconos: `@mui/icons-material`.
  - Gestión de Estado: `React Context API`.
  - Peticiones HTTP: `axios`.
- **Backend**:
  - Runtime: `Node.js`
  - Framework: `Express.js v5+`
  - Acceso a Base de Datos: `Knex.js` para seeding. `mysql2` para consultas.
  - Base de Datos: `MySQL` (a través del driver `mysql2`).

## 3. Comandos Importantes (Important Commands)

- **Instalación inicial (desde la raíz del proyecto)**:
  ```bash
  pnpm install -r
  ```
- **Frontend (desde la carpeta `/frontend`):**
  - `pnpm dev`: Inicia el servidor de desarrollo de Vite.
  - `pnpm build`: Compila la aplicación para producción.
  - `pnpm lint`: Ejecuta el linter (ESLint) para revisar la calidad del código.
  - `pnpm preview`: Inicia un servidor local para ver la build de producción.
- **Backend (desde la carpeta `/backend`):**
  - `pnpm run start:dev`: Inicia el servidor de la API con `nodemon` para reinicios automáticos.
  - `pnpm run db:seed`: Popula la base de datos ejecutando el script de seed con Knex.

## 4. Convenciones y Estilo de Código (Code Conventions)

- **Formato General**: Seguir las convenciones de **Prettier con la configuración de Airbnb** siempre que sea posible. El objetivo es un código limpio, legible y consistente.
- **Nomenclatura**:
  - Variables y funciones: `camelCase`.
  - Componentes de React: `PascalCase`.
- **Comentarios**: Incluir documentación **JSDoc** para todas las funciones exportadas y componentes principales.
- **Alias de Importación**: Utilizar siempre los alias definidos en los `imports` de los `package.json` para rutas más limpias.
  - Backend: `#routes/*`, `#services/*`, `#controllers/*`, etc.
  - Frontend: `#components/*`, `#context/*`, `#hooks/*`.
- **Paleta de Colores**: La paleta de colores principal está definida en `frontend/src/theme/theme.js`. Solo se deben usar colores de este fichero o colores que armonicen con ellos.

## 5. Reglas y Guías Adicionales (Rules & Guidelines)

- **Base de Datos**: Todos los cambios en el esquema de la base de datos **deben** realizarse a través de migraciones de Knex. No alterar la BD manualmente.
- **UI**: La UI se construye con Material UI (MUI). Dar preferencia a sus componentes y sistema de diseño.
- **Gestión de Estado**: Usar la `Context API` de React, siguiendo el patrón de los contextos existentes en `frontend/src/context`.
- **Archivos**: El backend está en la carpeta `./backend` y el frontend en `./frontend`.
