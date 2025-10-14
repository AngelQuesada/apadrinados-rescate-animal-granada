import { useEffect, useState } from "react";
import { useDogsContext } from "../context/useDogsContext";
import { useUIContext } from "../context/useUIContext";

// Crea el useSponsorForm hook teniendo en cuenta lo que hay y podríamos meter desde SponsorForm.jsx
const useSponsorForm = () => {
  const { onDogProfile, sponsors } = useDogsContext();
  const { sponsorForm, closeSponsorForm } = useUIContext();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [emailInputValue, setEmailInputValue] = useState("");

  const profileDogSponsors = onDogProfile?.sponsors || [];

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
      const isEmailTaken = sponsors.some(
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        console.log("Updating sponsor:", {
          ...sponsorForm.sponsor,
          ...formData,
        });
      } else {
        console.log("Adding new sponsor:", formData);
      }
      closeSponsorForm();
    }
  };

  const handleClose = () => {
    closeSponsorForm();
  };

  const filterExistingSponsors = () => {
    return emailInputValue?.length > 5
      ? sponsors.filter(
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
