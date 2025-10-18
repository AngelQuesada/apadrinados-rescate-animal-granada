import { AppBar, Toolbar, Box, useMediaQuery, useTheme, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { useUIContext } from "#hooks/context/useUIContext";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { setIsSearchOpen } = useUIContext();

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{ backgroundColor: theme.palette.background.paper }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link to={`/`} style={{ textDecoration: "none" }}>
            <img
              src={isMobile ? "/logo_small.png" : "/logo_long.png"}
              alt="Rescate Animal Granada"
              style={{ height: isMobile ? "40px" : "50px" }}
            />
          </Link>
        </Box>
        <IconButton onClick={handleOpenSearch}>
          <Search />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
