import { useEffect, useMemo, useState } from "react";
import { useDogsContext } from "#hooks/context/useDogsContext";
import { useParams } from "react-router-dom";
import { useSnackbar } from "#hooks/context/useSnackbar";
import { useUIContext } from "#hooks/context/useUIContext";
import useAxios from "#hooks/useAxios";
import { copyToClipboard } from "../../utils/helpers";

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

  const { openSponsorForm, isMobile } = useUIContext();

  const { error, del } = useAxios();

  const { id } = useParams();

  const dog = useMemo(
    () => allDogs.find((d) => d.id === parseInt(id)),
    [allDogs, id]
  );

  const { name, imageUrl, sponsors: dogSponsors, modified } = dog || {};

  const sortedSponsors = useMemo(() => {
    if (!dogSponsors) return [];
    return [...dogSponsors].sort((a, b) => {
      const aIsPaypal = a.source === 1;
      const bIsPaypal = b.source === 1;

      // Mover los padrinos de PayPal al final
      if (aIsPaypal && !bIsPaypal) return 1;
      if (!aIsPaypal && bIsPaypal) return -1;

      // Ordenar por fecha de creación (más reciente primero)
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [dogSponsors]);

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

  const handleSelectAllSponsors = (checked) => {
    if (checked) {
      const selectableSponsors = dogSponsors
        .filter((s) => s.source !== 1)
        .map((s) => s.dog_sponsor_id);
      setSelectedSponsors(selectableSponsors);
    } else {
      setSelectedSponsors([]);
    }
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

  const handleCopySponsorEmails = async () => {
    if (dogSponsors && dogSponsors.length > 0) {
      const emails = dogSponsors.map((sponsor) => sponsor.email).join(", ");
      await copyToClipboard(emails);
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
              modified: response.newModifiedDate,
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
    isMobile,
    showSnackbar,
    openSponsorForm,
    confirmDeleteOpen,
    setAllDogs,
    error,
    sortedSponsors,
    setConfirmDeleteOpen,
    setSelectedSponsors,
    handleSelectSponsor,
    handleOpenSponsorForm,
    handleClickDeleteSponsorSelection,
    handleCopySponsorEmails,
    handleClickDeleteSponsor,
    handleDeleteSponsor,
    handleSelectAllSponsors,
  };
};

export default useDogProfile;
