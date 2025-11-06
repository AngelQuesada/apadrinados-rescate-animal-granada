import { Backdrop, Box } from "@mui/material";
import Header from "#components/Header/Header";
import { useUIContext } from "#hooks/context/useUIContext";
import Search from "#components/Search/Search";

const Layout = ({ children }) => {
  const { isSearchOpen, setIsSearchOpen } = useUIContext();

  return (
    <Box sx={{ minHeight: "100vh" }}>
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
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, backdropFilter: "blur(3px)", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        open={isSearchOpen}
        onClick={() => setIsSearchOpen(false)}
      >
        <Box onClick={(e) => e.stopPropagation()}>
          <Search />
        </Box>
      </Backdrop>
    </Box>
  );
};

export default Layout;
