import { createContext, useContext, useState } from "react";
import { Grid, Tag } from "antd";
const { useBreakpoint } = Grid;

const PopupContext = createContext();

export const usePopup = () => {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error("usePopup must be used within an PopupProvider");
  }

  return context;
};

export const PopupProvider = ({ children }) => {
  // Screen
  const screens = useBreakpoint();

  // Open & Close Popup Window
  const [isPopupWindow, setIsPopupWindow] = useState(false);

  const [popupContent, setPopupContent] = useState({});

  const openPopupWindow = (icon, title, content, className) => {
    setPopupContent({
      icon: icon,
      title: title,
      renderContent: content,
      className: className,
    });
    setIsPopupWindow(true);
  };

  const closePopupWindow = () => {
    setIsPopupWindow(false);
    setPopupContent({});
  };

  return (
    <PopupContext.Provider
      value={{
        screens,

        isPopupWindow,
        popupContent,

        openPopupWindow,
        closePopupWindow,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};
