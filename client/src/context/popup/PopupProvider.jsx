import { useState } from "react";

import { Grid } from "antd";

import { PopupContext } from "./usePopup";

const { useBreakpoint } = Grid;

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
