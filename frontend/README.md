# Frontend

This is the frontend for the dog sponsorship platform. It is a single-page application built with React 18 and Vite.

## Dependencies

-   [React 18](https://reactjs.org/)
-   [Vite](https://vitejs.dev/)
-   [Material-UI](https://mui.com/)
-   [Axios](https://axios-http.com/)
-   [React Router](https://reactrouter.com/)
-   [Click To React Component](https://github.com/ericclemmons/click-to-react-component)

## Development

To start the development server, run:

```bash
pnpm dev
```

## Testing

Este proyecto contiene tanto tests unitarios (con Jest) como tests End-to-End (con Playwright).

-   **Para ejecutar los tests unitarios:**
    ```bash
    pnpm test
    ```
-   **Para ejecutar los tests End-to-End:**
    ```bash
    pnpm test:e2e
    ```

### Mejoras Recientes en Tests E2E

La suite de tests E2E en `tests/e2e/dog-sponsorship.spec.js` ha sido refactorizada recientemente para mejorar su fiabilidad y mantenibilidad. Las mejoras clave incluyen:

-   **Corrección de un Test Crítico:** Se ha solucionado un fallo recurrente en el test de "copiar emails". La solución implicó la corrección de un mock defectuoso de la API del portapapeles del navegador y la mejora de los selectores de elementos para que sean más resilientes.
-   **Uso de Fixtures:** Los tests se han actualizado para utilizar "fixtures" de Playwright para la gestión de datos de prueba. Esto hace que los tests sean más predecibles y fáciles de leer al separar la configuración de los datos de la lógica del test.
-   **Refactorización General:** Se han limpiado los tests, con nombres más claros, una mejor estructura y la adición de un nuevo "sanity check" para asegurar que la página principal de la aplicación se carga correctamente.

Estos cambios han dado como resultado un entorno de testing E2E más estable y robusto.
