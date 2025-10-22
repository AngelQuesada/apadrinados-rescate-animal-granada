import { useEffect, useMemo, useState } from "react";
import { useDogsContext } from "#hooks/context/useDogsContext";
import { useParams } from "react-router-dom";
import { useSnackbar } from "#hooks/context/useSnackbar";
import { useUIContext } from "#hooks/context/useUIContext";
import useAxios from "#hooks/useAxios";

const useDogProfile = () => {
  const [selectedSponsors, setSelectedSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [loadingDogProfile, setLoadingDogProfile] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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
    if (error) {
      showSnackbar(error.message, "error");
      setSelectedSponsors([]);
      setConfirmDeleteOpen(false);
      console.error("Error:", error);
    }
  }, [error, showSnackbar, setSelectedSponsors]);

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

  const handleClickDeleteSponsor = (sponsorId) => {
    setSelectedSponsor(sponsorId);
    setSelectedSponsors([]);
    setConfirmDeleteOpen(true);
  };

  const handleClickDeleteSponsorSelection = () => {
    setConfirmDeleteOpen(true);
  };

  const handleCopySponsorEmails = () => {
    if (dogSponsors && dogSponsors.length > 0) {
      const emails = dogSponsors.map((sponsor) => sponsor.email).join(", ");
      navigator.clipboard.writeText(emails);
      showSnackbar("Emails copiados al portapapeles", "success");
    }
  };

  const handleDeleteSponsor = async () => {
    setConfirmDeleteOpen(false);
    setLoadingDogProfile(true);

    const sponsorsToDelete = selectedSponsor
      ? [selectedSponsor]
      : selectedSponsors;

    const response = await del(
      `/wordpress/delete-dog-sponsors/${sponsorsToDelete.join(",")}`
    );

    if (response.ok) {
      setAllDogs(
        allDogs.map((dog) => {
          if (dog.id === profileDog.id) {
            return {
              ...dog,
              sponsors: dog.sponsors.filter(
                (sponsor) => !sponsorsToDelete.includes(sponsor.dog_sponsor_id)
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
    selectedSponsors,
    profileDog,
    name,
    imageUrl,
    dogSponsors,
    allSponsors,
    modified,
    showSnackbar,
    openSponsorForm,
    confirmDeleteOpen,
    setAllDogs,
    error,
    setConfirmDeleteOpen,
    setSelectedSponsors,
    handleSelectSponsor,
    handleOpenSponsorForm,
    handleClickDeleteSponsorSelection,
    handleCopySponsorEmails,
    handleClickDeleteSponsor,
    handleDeleteSponsor,
  };
};

export default useDogProfile;
