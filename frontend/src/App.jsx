import { DogsProvider } from "./context/DogsContext";
import { useDogsContext } from "./hooks/context/useDogsContext";

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
    <DogsProvider>
      <div>
        <h1>Perros</h1>
        <DogsList />
      </div>
    </DogsProvider>
  );
}

export default App;
