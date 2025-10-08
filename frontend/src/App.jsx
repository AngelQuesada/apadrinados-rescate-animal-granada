import { DogsProvider } from "./context/DogsContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import Layout from "./components/Layout/Layout";
import { Container } from "@mui/material";
import { UIProvider } from "./context/UIContext";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import DogsGrid from "./components/DogsGrid/DogsGrid";
import ImagePopup from "./components/ImagePopUp/ImagePopUp";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UIProvider>
        <DogsProvider>
          <LoadingScreen />
          <Layout>
            <Container>
              <DogsGrid />
            </Container>
            <LoadingScreen />
            <ImagePopup />
          </Layout>
        </DogsProvider>
      </UIProvider>
    </ThemeProvider>
  );
}

export default App;
