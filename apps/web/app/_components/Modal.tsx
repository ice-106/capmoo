"use client";

import React from "react";

interface ModalProps {
  // Whether the modal is open or closed 
  isOpen: boolean;
  // Called when the backdrop or close button is clicked 
  onClose: () => void;
  // The content displayed inside the modal 
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Closes the modal if the user clicks directly on the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white p-4 rounded-md shadow-md w-[90%] max-w-sm">
        {/* Close button (X) in the top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
