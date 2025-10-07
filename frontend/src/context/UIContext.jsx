import { useState } from "react";
import { UIContext } from "./UI-context-definition";

export const UIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <UIContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
