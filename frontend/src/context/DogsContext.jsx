import { useEffect, useMemo, useState } from "react";
import { DogsContext } from "./dogs-context-definition";
import useAxios from "../hooks/useAxios";

export const DogsProvider = ({ children }) => {
  const [onDogProfile, setOnDogProfile] = useState(false);

  const {
    data: dogsData,
    error: dogsError,
    loading: dogsLoading,
    get: getDogs,
  } = useAxios();

  const {
    data: sponsorsData,
    error: sponsorsError,
    loading: sponsorsLoading,
    get: getSponsors,
  } = useAxios();

  // Realizamos las peticiones iniciales una sola vez
  useEffect(() => {
    const fetchDogsData = async () => {
      try {
        await getDogs("/wordpress/get-dogs-structured-data");
      } catch (err) {
        console.error("Error fetching dogs:", err);
      }
    };

    fetchDogsData();
  }, [getDogs]);

  useEffect(() => {
    const fetchSponsorsData = async () => {
      try {
        await getSponsors("/wordpress/get-all-sponsors");
      } catch (err) {
        console.error("Error fetching sponsors:", err);
      }
    };

    fetchSponsorsData();
  }, [getSponsors]);

  const error = dogsError || sponsorsError;

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
    }
  }, [error]);

  const contextValue = useMemo(
    () => ({
      dogs: dogsData?.dogs || [],
      sponsors: sponsorsData?.sponsors || [],
      loading: dogsLoading || sponsorsLoading,
      error: error,
      onDogProfile,
      setOnDogProfile,
    }),
    [dogsData, sponsorsData, dogsLoading, sponsorsLoading, error, onDogProfile]
  );

  return (
    <DogsContext.Provider value={contextValue}>{children}</DogsContext.Provider>
  );
};
