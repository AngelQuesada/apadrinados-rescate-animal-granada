# Plataforma de Apadrinamiento de Perros

![Estado del Build](https://img.shields.io/badge/build-passing-brightgreen)
![Licencia](https://img.shields.io/badge/license-MIT-blue.svg)
![Versión](https://img.shields.io/badge/version-1.0.0-informational)

Este proyecto es una aplicación web full-stack diseñada para facilitar el apadrinamiento de perros. Permite a los usuarios ver perfiles de perros disponibles, buscar por nombre y realizar apadrinamientos de forma segura a través de una integración con PayPal.

La aplicación está construida con un backend en Node.js/Express y un frontend en React (Vite), siguiendo una arquitectura de monorepo.

## Stack Tecnológico

| Área | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | UI moderna y rápida con un sistema de componentes. |
| | Material-UI | Componentes de UI para un diseño consistente y profesional. |
| | Axios | Cliente HTTP para la comunicación con el backend. |
| | React Context | Manejo de estado global para la UI y los datos de los perros. |
| | Click To React Component | Librería para inspeccionar componentes en el navegador. |
| **Backend** | Node.js, Express | API RESTful robusta y escalable. |
| | Knex.js, SQLite | Constructor de consultas SQL y base de datos relacional. |
| | PayPal API | Integración para procesar los pagos de apadrinamiento. |
| | WordPress API | Consumo de datos de perros desde una fuente externa (CMS). |
| **General** | pnpm | Gestor de paquetes rápido y eficiente. |
| | ESLint | Linting para mantener la calidad y consistencia del código. |
| | Jest | Framework de testing para frontend y backend. |

## Features Principales

- **Listado de Perros:** Visualización de perros apadrinables y no apadrinables en secciones separadas.
- **Búsqueda en Tiempo Real:** Búsqueda instantánea de perros por nombre.
- **Perfil Detallado:** Vista detallada del perfil de cada perro.
- **Formulario de Apadrinamiento:** Formulario para que los usuarios se conviertan en padrinos.
- **Integración con PayPal:** Proceso de pago seguro para formalizar el apadrinamiento.
- **Diseño Responsivo:** Interfaz adaptable a diferentes tamaños de pantalla.

## Arquitectura

El proyecto sigue una arquitectura de cliente-servidor desacoplada dentro de un monorepo:

- **`/frontend`**: Una Single Page Application (SPA) construida con React que consume la API del backend.
- **`/backend`**: Una API RESTful que gestiona la lógica de negocio, la base de datos y las integraciones con servicios externos.

Para más detalles, consulta el documento de [**Arquitectura del Proyecto (`ARCHITECTURE.md`)**](./ARCHITECTURE.md).

## Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 20.x o superior)
- [pnpm](https://pnpm.io/installation)

## Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/rag_maillist.git
    cd rag_maillist
    ```

2.  **Configurar el Backend:**
    - Navega al directorio del backend: `cd backend`
    - Crea un fichero `.env` a partir del ejemplo: `copy .env.example .env`
    - Rellena las variables de entorno en `.env` con tus credenciales de PayPal y la URL de WordPress.
    - Instala las dependencias: `pnpm install`
    - Ejecuta las migraciones y seeds de la base de datos:
      ```bash
      pnpm knex migrate:latest
      pnpm knex seed:run
      ```

3.  **Configurar el Frontend:**
    - Navega al directorio del frontend: `cd ../frontend`
    - Crea un fichero `.env` a partir del ejemplo: `copy .env.example .env`
    - Configura la variable `VITE_API_URL` para que apunte a tu servidor backend (por defecto `http://localhost:3001`).
    - Instala las dependencias: `pnpm install`

## Uso

Para poner en marcha la aplicación, necesitas ejecutar tanto el backend como el frontend en terminales separadas.

1.  **Iniciar el Backend:**
    ```bash
    cd backend
    pnpm run dev
    ```
    El servidor se iniciará en `http://localhost:3001`.

2.  **Iniciar el Frontend:**
    ```bash
    cd frontend
    pnpm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## Ejecución de Tests

-   **Backend:**
    ```bash
    cd backend
    pnpm test
    ```

-   **Frontend:**
    ```bash
    cd frontend
    pnpm test
    ```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, lee la [**guía de contribución (`CONTRIBUTING.md`)**](./CONTRIBUTING.md) para más detalles sobre cómo participar.

## Código de Conducta

Este proyecto se adhiere al [**Código de Conducta (`CODE_OF_CONDUCT.md`)**](./CODE_OF_CONDUCT.md). Al participar, se espera que respetes este código.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el fichero [LICENSE](LICENSE) para más detalles.
