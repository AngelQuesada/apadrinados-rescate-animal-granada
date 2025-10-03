import { useState, useEffect } from "react";
import axios from "axios";
import { DogsContext } from "./dogs-context-definition";

export const DogsProvider = ({ children }) => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/wordpress/get-dogs-structured-data")
      .then((response) => {
        console.log(response);
        setDogs(response.data.dogs);
      })
      .catch((error) => {
        console.error("Error al cargar los perros:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <DogsContext.Provider
      value={{
        dogs,
        loading,
      }}
    >
      {children}
    </DogsContext.Provider>
  );
};
