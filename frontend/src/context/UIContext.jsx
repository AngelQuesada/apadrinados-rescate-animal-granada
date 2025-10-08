import { useState } from "react";
import { UIContext } from "./UI-context-definition";

export const UIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [imageUrlForPopup, setImageUrlForPopup] = useState("");

  return (
    <UIContext.Provider
      value={{
        loading,
        setLoading,
        imagePopupOpen,
        setImagePopupOpen,
        imageUrlForPopup,
        setImageUrlForPopup,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
