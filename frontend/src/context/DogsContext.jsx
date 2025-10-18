import { useEffect, useMemo, useState } from "react";
import { DogsContext } from "#context/dogs-context-definition";
import useAxios from "#hooks/useAxios";

export const DogsProvider = ({ children }) => {
  const [profileDog, setProfileDog] = useState(false);
  const [allDogs, setAllDogs] = useState([]);
  const [allSponsors, setAllSponsors] = useState([]);

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

  const error = dogsError || sponsorsError;

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
    }
  }, [error]);

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

  useEffect(() => {
    setAllDogs(dogsData?.dogs || []);
  }, [dogsData, setAllDogs]);

  useEffect(() => {
    setAllSponsors(sponsorsData?.sponsors || []);
  }, [sponsorsData, setAllSponsors]);

  const contextValue = useMemo(
    () => ({
      allDogs: allDogs || [],
      allSponsors: allSponsors || [],
      loading: dogsLoading || sponsorsLoading,
      error: error,
      profileDog,
      setProfileDog,
      setAllDogs,
      setAllSponsors,
    }),
    [dogsLoading, sponsorsLoading, error, profileDog, allDogs, allSponsors]
  );

  return (
    <DogsContext.Provider value={contextValue}>{children}</DogsContext.Provider>
  );
};
