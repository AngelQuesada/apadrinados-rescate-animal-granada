import { Box, CircularProgress, Typography } from "@mui/material";
import { useUIContext } from "../../hooks/context/useUIContext";

const LoadingScreen = () => {
  const { loading } = useUIContext();

  if (!loading) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "primary.main",
        opacity: 0.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <CircularProgress color="secondary" />
      <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>
        Cargando
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
