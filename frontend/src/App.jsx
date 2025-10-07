import { DogsProvider } from "./context/DogsContext";
import { useDogsContext } from "./hooks/context/useDogsContext";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import Layout from "./components/Layout/Layout";
import { Container } from "@mui/material";
import { UIProvider } from "./context/UIContext";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";

function DogsList() {
  const { dogs, loading } = useDogsContext();

  if (loading) {
    return <p>Cargando perros...</p>;
  }

  if (dogs.length === 0) {
    return <p>No se encontraron perros.</p>;
  }

  return (
    <ul>
      {dogs.map((dog) => (
        <li key={dog.id}> {dog.name}</li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UIProvider>
        <DogsProvider>
          <LoadingScreen />
          <Layout>
            <Container maxWidth="lg">
              <h1>Perros</h1>
              <DogsList />
            </Container>
            <LoadingScreen />
          </Layout>
        </DogsProvider>
      </UIProvider>
    </ThemeProvider>
  );
}

export default App;
