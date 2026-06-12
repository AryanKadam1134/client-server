import { createContext, useContext } from "react";

export const PopupContext = createContext();

export const usePopup = () => {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error("usePopup must be used within an PopupProvider");
  }

  return context;
};
