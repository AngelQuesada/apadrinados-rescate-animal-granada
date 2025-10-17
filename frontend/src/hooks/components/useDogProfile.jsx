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
  const [loadingDogProfile, setLoadingDogProfile] = useState(false);

  const {
    allDogs,
    setAllDogs,
    allSponsors,
    loading: loadingDogContext,
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

  const handleCopySponsorEmails = () => {
    if (dogSponsors && dogSponsors.length > 0) {
      const emails = dogSponsors.map((sponsor) => sponsor.email).join(", ");
      navigator.clipboard.writeText(emails);
      showSnackbar("Emails copiados al portapapeles", "success");
    }
  };

  const handleDeleteSponsor = async (dogSponsorId) => {
    setLoadingDogProfile(true);
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
    setLoadingDogProfile(false);
  };

  const loading = loadingDogProfile || loadingDogContext;

  return {
    loading,
    loadingDogContext,
    loadingDogProfile,
    bottomPadding,
    selectedSponsors,
    selectedSponsor,
    profileDog,
    name,
    imageUrl,
    dogSponsors,
    allSponsors,
    modified,
    showSnackbar,
    openSponsorForm,
    setAllDogs,
    error,
    setSelectedSponsors,
    handleSelectSponsor,
    handleOpenSponsorForm,
    handleDeleteSelection,
    handleCopySponsorEmails,
    handleDeleteSponsor,
    setSelectedSponsor,
  };
};

export default useDogProfile;
