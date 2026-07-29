import { useState } from "react";

import GlobalModal from "../../components/common/GlobalModal";

import { ModalContext } from "./useModal";

export const ModalProvider = ({ children }) => {
  // Open & Close Modal
  const [isModalOpen, setModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState({});

  const openModal = (icon, title, content, className) => {
    setModalContent({
      icon: icon,
      title: title,
      renderContent: content,
      className: className,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent({});
  };

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        modalContent,

        openModal,
        closeModal,
      }}
    >
      <GlobalModal />
      {children}
    </ModalContext.Provider>
  );
};
