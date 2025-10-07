import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.primary.main,
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Rescate Animal Granada. Todos los derechos
          reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
