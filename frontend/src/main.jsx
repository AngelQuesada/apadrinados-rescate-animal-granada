import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { DogsProvider } from "./context/DogsContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";
import { SnackbarProvider } from "./context/SnackbarContext.jsx";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <UIProvider>
          <DogsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </DogsProvider>
        </UIProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>
);
