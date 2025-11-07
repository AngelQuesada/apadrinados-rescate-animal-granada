import { useState } from "react";
import { UIContext } from "#context/UI-context-definition";
import { useMediaQuery, useTheme } from "@mui/material";

export const UIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [imageUrlForPopup, setImageUrlForPopup] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({
    isOpen: false,
    sponsor: null,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

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
        isMobile
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
