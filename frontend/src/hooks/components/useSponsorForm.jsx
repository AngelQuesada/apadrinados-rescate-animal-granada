import { useEffect, useState } from "react";
import { useDogsContext } from "../context/useDogsContext";
import { useUIContext } from "../context/useUIContext";
import { useSnackbar } from "../context/useSnackbar";
import useAxios from "../useAxios";

const useSponsorForm = () => {
  const { profileDog, allSponsors, setAllDogs, allDogs } = useDogsContext();
  const { sponsorForm, closeSponsorForm } = useUIContext();
  const { error, loading: loadingAxios, post } = useAxios();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [emailInputValue, setEmailInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const profileDogSponsors = profileDog?.sponsors || [];

  useEffect(() => {
    setLoading(loadingAxios);
  }, [loadingAxios]);

  useEffect(() => {
    setIsEditMode(sponsorForm.sponsor !== null);
  }, [sponsorForm.sponsor]);

  useEffect(() => {
    if (sponsorForm.isOpen) {
      if (isEditMode) {
        setFormData({
          name: sponsorForm.sponsor.name || "",
          email: sponsorForm.sponsor.email || "",
        });
        setEmailInputValue(sponsorForm.sponsor.email || "");
      } else {
        setFormData({ name: "", email: "" });
        setEmailInputValue("");
      }
      setErrors({ name: "", email: "" });
    }
  }, [sponsorForm.isOpen, sponsorForm.sponsor, isEditMode]);

  useEffect(() => {
    if (error) {
      showSnackbar(error.message, "error");
      console.error("Error:", error);
    }
  }, [error, showSnackbar]);

  const validate = () => {
    const newErrors = { name: "", email: "" };
    let isValid = true;

    if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Por favor, introduce un email válido.";
      isValid = false;
    } else {
      const isEmailTaken = allSponsors.some(
        (sponsor) =>
          sponsor.email.toLowerCase() === formData.email.toLowerCase() &&
          (isEditMode ? sponsor.id !== sponsorForm.sponsor.id : true)
      );
      if (isEmailTaken) {
        newErrors.email = "Este email ya está registrado como sponsor.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        console.log("Updating sponsor:", {
          ...sponsorForm.sponsor,
          ...formData,
        });
      } else {
        const { name, email } = formData;
        const { id: dog_id } = profileDog;

        const response = await post("/wordpress/save-sponsor-and-dog-sponsor", {
          name,
          email,
          dog_id,
        });

        if (response.ok) {
          const { newSponsor } = response;
          setAllDogs(
            allDogs.map((dog) => {
              if (dog.id === profileDog.id) {
                return {
                  ...dog,
                  sponsors: [...dog.sponsors, newSponsor],
                };
              }

              return dog;
            })
          );
          // TODO: también debes actualizar el allSponsors
          showSnackbar(response.message, "success");
        }
      }
      closeSponsorForm();
    }
  };

  const handleClose = () => {
    !loading && closeSponsorForm();
  };

  const filterExistingSponsors = () => {
    return emailInputValue?.length > 5
      ? allSponsors.filter(
          (sponsor) =>
            sponsor.email
              .toLowerCase()
              .startsWith(emailInputValue.toLowerCase()) &&
            !profileDogSponsors.find(
              (profileSponsor) => profileSponsor.id === sponsor.id
            )
        )
      : [];
  };

  return {
    formData,
    errors,
    isEditMode,
    emailInputValue,
    profileDogSponsors,
    loading,
    sponsorForm,
    setFormData,
    validate,
    handleSubmit,
    handleClose,
    filterExistingSponsors,
    setEmailInputValue,
  };
};

export default useSponsorForm;
