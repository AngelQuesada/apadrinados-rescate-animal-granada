# Arquitectura del Proyecto

Este documento describe la arquitectura de alto nivel de la Plataforma de Apadrinamiento de Perros, incluyendo el diseño del backend y del frontend, y cómo interactúan entre sí.

## Visión General

El proyecto está estructurado como un **monorepo** con dos componentes principales y desacoplados:

-   **`backend/`**: Una API RESTful construida con Node.js y Express.
-   **`frontend/`**: Una Single Page Application (SPA) construida con React y Vite.

Esta separación permite desarrollar, probar y desplegar cada parte de la aplicación de forma independiente.

---

## Arquitectura del Backend

El backend se encarga de la lógica de negocio, el acceso a datos y la comunicación con servicios de terceros.

### Estructura de Carpetas

-   **`/config`**: Configuración centralizada (ej. variables de entorno).
-   **`/controllers`**: Manejan las peticiones HTTP, validan la entrada y orquestan las respuestas llamando a los servicios.
-   **`/db`**: Contiene la configuración de la base de datos con Knex, las migraciones (schema) y los seeds (datos iniciales).
-   **`/middlewares`**: Funciones que se ejecutan antes de llegar a las rutas (ej. manejo de errores).
-   **`/routes`**: Definen los endpoints de la API y los asocian con los controladores correspondientes.
-   **`/services`**: Contienen la lógica de negocio principal. Son llamados por los controladores y se comunican con la base de datos o servicios externos.
-   **`/utils`**: Utilidades reutilizables, como clases de error personalizadas.
-   **`/__tests__`**: Pruebas unitarias y de integración para los servicios y controladores.

### Flujo de Datos y Lógica

1.  **Ruta (`routes`)**: Una petición llega a un endpoint (ej. `GET /api/dogs`).
2.  **Controlador (`controllers`)**: El controlador correspondiente (`wordpressController.getDogs`) recibe la petición.
3.  **Servicio (`services`)**: El controlador invoca al servicio (`wordpressService.fetchActiveDogs`).
4.  **Lógica de Negocio**: El servicio ejecuta la lógica principal:
    -   Se comunica con la **API de WordPress** para obtener los datos de los perros.
    -   Consulta la **base de datos local (SQLite)** a través de Knex para saber qué perros ya han sido apadrinados.
    -   Fusiona y procesa los datos de ambas fuentes.
5.  **Respuesta**: El servicio devuelve los datos procesados al controlador, que a su vez los envía como respuesta HTTP al cliente.

### Integraciones Externas

-   **WordPress API**: Actúa como un Headless CMS. Se utiliza para obtener la lista de perros y sus detalles, desacoplando la gestión de contenido de la aplicación principal.
-   **PayPal API**: Se integra en el flujo de apadrinamiento para procesar los pagos de forma segura. El backend se comunica con PayPal para crear y verificar las transacciones.

---

## Arquitectura del Frontend

El frontend es una aplicación React moderna y reactiva que proporciona una experiencia de usuario fluida.

### Estructura de Carpetas

-   **`/components`**: Componentes de UI reutilizables (ej. `DogCard`, `Header`, `SponsorForm`).
-   **`/context`**: React Context para el manejo de estado global. Se divide en:
    -   `DogsContext`: Almacena y gestiona los datos de los perros.
    -   `UIContext`: Controla el estado de la UI (ej. modales, loading screens).
    -   `SnackbarContext`: Gestiona las notificaciones (snackbars) para el usuario.
-   **`/hooks`**: Hooks personalizados para encapsular lógica reutilizable:
    -   `useAxios`: Hook genérico para realizar peticiones HTTP.
    -   Hooks de componente (`useDogProfile`, `useSponsorForm`): Lógica específica de un componente o vista.
    -   Hooks de contexto (`useDogsContext`, `useUIContext`): Proporcionan acceso fácil a los contextos.
-   **`/pages`**: Componentes que representan páginas completas de la aplicación (ej. `DogProfile`).
-   **`/theme`**: Configuración del tema de Material-UI (colores, tipografía).

### Manejo de Estado

El estado se gestiona principalmente con una combinación de **React Context** y el hook `useState`.

-   **Estado Global (Context API)**: Se utiliza para datos que necesitan ser accesibles desde múltiples lugares en el árbol de componentes, como la lista de perros, el estado de la UI (loading/idle) y las notificaciones. Esto evita el *prop drilling*.
-   **Estado Local (`useState`)**: Se utiliza para el estado que es específico de un componente, como el contenido de un campo de formulario antes de ser enviado.

### Flujo de Datos y Componentes

1.  **Carga Inicial**: Al cargar la aplicación, `App.jsx` utiliza `useDogsContext` para solicitar la lista de perros al backend.
2.  **Renderizado**: El componente `DogsGrid` recibe los datos del contexto y renderiza una lista de `DogCard`.
3.  **Interacción del Usuario**: El usuario interactúa con la UI (ej. usa el componente `Search` o hace clic en una `DogCard`).
4.  **Actualización de Estado**: Las interacciones actualizan el estado (local o global), lo que provoca un nuevo renderizado de los componentes afectados.
5.  **Comunicación con el Backend**: Para acciones como apadrinar, el componente `SponsorForm` utiliza el hook `useAxios` para enviar los datos al backend. La respuesta del backend (éxito o error) se comunica al usuario a través del `SnackbarContext`.
