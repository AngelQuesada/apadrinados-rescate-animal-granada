import { useState, useCallback } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import { SnackbarContext } from "./snackbar-context-definition";

function TransitionSlide(props) {
  return <Slide {...props} direction="up" />;
}

export function SnackbarProvider({ children }) {
  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarConfig((prev) => ({ ...prev, open: false }));
  };

  /**
   * Shows a snackbar with a message and severity.
   * @param {string} message - The message to display.
   * @param {('success'|'error'|'warning'|'info')} [severity] - The severity of the alert. If not provided, the snackbar will have a white background.
   */
  const showSnackbar = useCallback((message, severity) => {
    setSnackbarConfig({
      open: true,
      message,
      severity: severity || "default",
    });
  }, []);

  const isDefault = snackbarConfig.severity === "default";
  const alertSeverity = isDefault ? "info" : snackbarConfig.severity;
  const alertSx = isDefault
    ? { bgcolor: "#ffffff", color: "rgba(0, 0, 0, 0.87)" }
    : {};

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbarConfig.open}
        autoHideDuration={2000}
        onClose={handleClose}
        TransitionComponent={TransitionSlide}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ maxWidth: "600px", width: "100%", bottom: { xs: 90, sm: 20 } }}
      >
        <Alert
          onClose={handleClose}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: "100%", ...alertSx }}
        >
          {snackbarConfig.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
