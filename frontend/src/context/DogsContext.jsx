import { useState, useEffect } from "react";
import axios from "axios";
import { DogsContext } from "./dogs-context-definition";

export const DogsProvider = ({ children }) => {
  const [dogs, setDogs] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/wordpress/get-dogs-structured-data")
      .then((response) => {
        setDogs(response.data.dogs);
      })
      .catch((error) => {
        console.error("Error al cargar los perros:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/wordpress/get-all-sponsors")
      .then((response) => {
        setSponsors(response.data.sponsors);
      })
      .catch((error) => {
        console.error("Error al cargar los patrocinadores:", error);
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
        sponsors,
      }}
    >
      {children}
    </DogsContext.Provider>
  );
};
