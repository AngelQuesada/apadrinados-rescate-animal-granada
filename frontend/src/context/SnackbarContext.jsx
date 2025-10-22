import { useState, useCallback } from "react";
import {
  Snackbar,
  Alert,
  Slide,
  AlertTitle,
  Box,
  Divider,
} from "@mui/material";
import {
  CheckCircleOutline,
  ReportProblemOutlined,
  WarningAmberOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { SnackbarContext } from "#context/snackbar-context-definition";

function TransitionSlide(props) {
  return <Slide {...props} direction="up" />;
}

const severityConfig = {
  success: { icon: <CheckCircleOutline />, title: "Éxito" },
  error: { icon: <ReportProblemOutlined />, title: "Error" },
  warning: { icon: <WarningAmberOutlined />, title: "Atención" },
  info: { icon: <InfoOutlined />, title: "Información" },
  default: { icon: <InfoOutlined />, title: "Información" },
};

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

  const showSnackbar = useCallback((message, severity) => {
    setSnackbarConfig({
      open: true,
      message,
      severity: severity || "default",
    });
  }, []);

  const alertSeverity =
    snackbarConfig.severity === "default" ? "info" : snackbarConfig.severity;

  const { icon, title } =
    severityConfig[snackbarConfig.severity] || severityConfig.default;

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
          variant="standard"
          icon={false}
          sx={(theme) => ({
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[3],
            border: `1px solid ${theme.palette.divider}`,
            "& .MuiAlert-message": {
              width: "100%",
            },
          })}
        >
          <AlertTitle>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: `${alertSeverity}.main`,
              }}
            >
              {icon}
              {title}
            </Box>
          </AlertTitle>
          <Divider sx={{ my: 1 }} />
          {snackbarConfig.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
