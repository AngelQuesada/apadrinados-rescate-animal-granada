import { AppBar, Toolbar, Box, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      </Toolbar>
    </AppBar>
  );
};

export default Header;
