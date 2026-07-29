import React from "react";

import profiloLogoBlack from "../../assets/profilo_logo_black.png";
import profiloLogoWhite from "../../assets/profilo_logo_white.png";

import { useTheme } from "../../context/theme/useTheme";

export default function AppLogo({ className = "" }) {
  const { theme } = useTheme();

  const logo = {
    light: profiloLogoBlack,
    dark: profiloLogoWhite,
  };

  return (
    <img src={logo[theme]} alt="Profilo Logo" className={`${className} `} />
  );
}
