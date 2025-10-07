import { useContext } from "react";
import { UIContext } from "../../context/UI-context-definition";

export const useUIContext = () => {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUIContext debe ser utilizado dentro de UIProvider");
  }

  return context;
};
