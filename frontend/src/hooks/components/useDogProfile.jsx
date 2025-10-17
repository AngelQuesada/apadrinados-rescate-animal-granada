import { useEffect, useMemo, useRef, useState } from "react";
import { useDogsContext } from "../context/useDogsContext";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../context/useSnackbar";
import { useUIContext } from "../context/useUIContext";
import useAxios from "../useAxios";

const useDogProfile = () => {
  const [bottomPadding, setBottomPadding] = useState(0);
  const [selectedSponsors, setSelectedSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  const {
    allDogs,
    setAllDogs,
    allSponsors,
    loading,
    setProfileDog,
    profileDog,
  } = useDogsContext();

  const { showSnackbar } = useSnackbar();

  const { openSponsorForm } = useUIContext();

  const { error, del } = useAxios();

  const menuRef = useRef(null);

  const { id } = useParams();

  const dog = useMemo(
    () => allDogs.find((d) => d.id === parseInt(id)),
    [allDogs, id]
  );

  const { name, imageUrl, sponsors: dogSponsors, modified } = dog || {};

  useEffect(() => {
    setProfileDog(dog);
  }, [dog, setProfileDog]);

  useEffect(() => {
    if (menuRef.current) {
      setBottomPadding(menuRef.current.offsetHeight + 10);
    }
  }, [dogSponsors]);

  useEffect(() => {
    if (error) {
      showSnackbar(error.message, "error");
      setSelectedSponsor(null);
      console.error("Error:", error);
    }
  }, [error, showSnackbar, setSelectedSponsor]);

  const handleSelectSponsor = (sponsorId) => {
    setSelectedSponsors((prevSelected) => {
      if (prevSelected.includes(sponsorId)) {
        return prevSelected.filter((id) => id !== sponsorId);
      } else {
        return [...prevSelected, sponsorId];
      }
    });
  };

  const handleOpenSponsorForm = () => {
    openSponsorForm();
  };

  const handleDeleteSelection = () => {
    showSnackbar("No implementado aún", "warning");
  };

  const handleDeleteSponsor = async (dogSponsorId) => {
    setSelectedSponsor(dogSponsorId);
    const response = await del(`/wordpress/delete-dog-sponsor/${dogSponsorId}`);
    if (response.ok) {
      setAllDogs(
        allDogs.map((dog) => {
          if (dog.id === profileDog.id) {
            return {
              ...dog,
              sponsors: dog.sponsors.filter(
                (sponsor) => sponsor.dog_sponsor_id !== dogSponsorId
              ),
            };
          }
          return dog;
        })
      );
      showSnackbar(response.message, "success");
    }
  };

  return {
    loading,
    bottomPadding,
    selectedSponsors,
    setSelectedSponsors,
    selectedSponsor,
    setSelectedSponsor,
    profileDog,
    name,
    imageUrl,
    dogSponsors,
    allSponsors,
    modified,
    showSnackbar,
    openSponsorForm,
    setAllDogs,
    handleSelectSponsor,
    handleOpenSponsorForm,
    handleDeleteSelection,
    handleDeleteSponsor,
    error,
  };
};

export default useDogProfile;
