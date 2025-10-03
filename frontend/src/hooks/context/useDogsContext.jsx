import { useContext } from "react";
import { DogsContext } from "../../context/dogs-context-definition";

export const useDogsContext = () => {
  const context = useContext(DogsContext);

  if (!context) {
    throw new Error("useDogsContext debe ser utilizado dentro de DogsProvider");
  }

  return context;
};
