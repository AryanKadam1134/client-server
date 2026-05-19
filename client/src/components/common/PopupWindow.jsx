import React, { useEffect } from "react";

import { X } from "lucide-react";

import { usePopup } from "../../context/PopupContext";

export default function PopupWindow() {
  // <!---------------------------------------- (Context) --------------------------------------------!>
  const { isPopupWindow, popupContent, closePopupWindow } = usePopup();

  // <!---------------------------------- (States & Variables) ---------------------------------------!>
  const title = popupContent?.title;
  const icon = popupContent?.icon;
  const content = popupContent?.renderContent;
  const className = popupContent?.className;

  // <!---------------------------------------- (Effects) --------------------------------------------!>
  useEffect(() => {
    if (isPopupWindow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPopupWindow]);

  return (
    <div className="fixed inset-0 z-100 flex justify-center items-center bg-black/50">
      <div className="relative max-w-[90%] max-h-[95%] bg-light-bg-primary dark:bg-dark-bg-tertiary border border-light-border-primary dark:border-dark-border-primary rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className={`sticky top-0 flex justify-between items-center px-4 py-3 text-[16px] text-white font-semibold ${className}`}
        >
          <div className="flex items-center gap-2">
            {icon} {title}
          </div>

          <div
            onClick={closePopupWindow}
            className="p-1 hover:backdrop-brightness-85 rounded-md cursor-pointer"
          >
            <X size={20} strokeWidth={3} className="cursor-pointer" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="place-items-center overflow-y-auto px-5 py-4 hide-scrollbar w-auto bg-light-bg-primary dark:bg-dark-bg-tertiary">
          {content}
        </div>
      </div>
    </div>
  );
}
