import { useState } from "react";
import { UIContext } from "#context/UI-context-definition";

export const UIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [imageUrlForPopup, setImageUrlForPopup] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({
    isOpen: false,
    sponsor: null,
  });

  const openSponsorForm = (sponsor = null) => {
    setSponsorForm({ isOpen: true, sponsor });
  };

  const closeSponsorForm = () => {
    setSponsorForm({ isOpen: false, sponsor: null });
  };

  return (
    <UIContext.Provider
      value={{
        loading,
        setLoading,
        imagePopupOpen,
        setImagePopupOpen,
        imageUrlForPopup,
        setImageUrlForPopup,
        isSearchOpen,
        setIsSearchOpen,
        sponsorForm,
        openSponsorForm,
        closeSponsorForm,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
