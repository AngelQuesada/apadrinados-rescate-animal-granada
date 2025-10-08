import { Box } from "@mui/material";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#F1F1F1FF",
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 0, sm: 3 },
          m: { xs: 0, sm: 3 },
          bgcolor: "background.paper",
          boxShadow: { xs: "none", sm: 1 },
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
