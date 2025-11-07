import { useEffect, useState } from "react";
import { useDogsContext } from "#hooks/context/useDogsContext";
import { useUIContext } from "#hooks/context/useUIContext";
import { useSnackbar } from "#hooks/context/useSnackbar";
import useAxios from "#hooks/useAxios";

const useSponsorForm = () => {
  const { profileDog, allSponsors, setAllDogs, allDogs } = useDogsContext();
  const { sponsorForm, closeSponsorForm } = useUIContext();
  const { error, loading: loadingAxios, post, put } = useAxios();
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
        const { name, email } = formData;

        const response = isEditMode
          ? await submitEditSponsor(name, email)
          : await submitSponsorAndDogSponsor(name, email);

        if (response.ok) {
          setAllDogs(
            allDogs.map((dog) => {
              if (dog.id === profileDog.id) {
                if (isEditMode) {
                  return {
                    ...dog,
                    sponsors: dog.sponsors.map((sponsor) => {
                      if (sponsor.id === sponsorForm.sponsor.id) {
                        return {
                          ...sponsor,
                          name,
                          email,
                        };
                      } else {
                        return sponsor;
                      }
                    }
                    ),
                    modified: response.newModifiedDate
                  };
                } else {
                  const { newSponsor } = response;

                  return {
                    ...dog,
                    sponsors: [...dog.sponsors, newSponsor],
                  };
                }
              }

              return dog;
            })
          );
          // TODO: Cambiar también en allSponsors
          showSnackbar(response.message, "success");
        }
      closeSponsorForm();
    }
  };

  const submitSponsorAndDogSponsor = async (name, email) => {
    const { id: dog_id } = profileDog;
    return await post("/wordpress/save-sponsor-and-dog-sponsor", {name, email, dog_id});
  }

  const submitEditSponsor = async (name, email) => {
    const { id } = sponsorForm.sponsor;
    return await put("/wordpress/update-sponsor", {id, name, email});
  }

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
