import { Routes, Route } from "react-router-dom";
import { DogsProvider } from "./context/DogsContext";
import { UIProvider } from "./context/UIContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";

import Layout from "./components/Layout/Layout";
import { Container } from "@mui/material";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import DogsGrid from "./components/DogsGrid/DogsGrid";
import ImagePopup from "./components/ImagePopUp/ImagePopUp";
import DogProfile from "./pages/DogProfile/DogProfile";
import SponsorForm from "./components/SponsorForm/SponsorForm";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UIProvider>
        <DogsProvider>
          <LoadingScreen />
          <Layout>
            <Container>
              <Routes>
                <Route
                  path="/"
                  element={<DogsGrid />}
                />
                <Route path="/dog-profile/:id" element={<DogProfile />} />
              </Routes>
            </Container>
          </Layout>
          <ImagePopup />
          <SponsorForm />
        </DogsProvider>
      </UIProvider>
    </ThemeProvider>
  );
}

export default App;
