import React from "react";
import ReactModal from "react-modal";

// Set the app element for accessibility reasons
ReactModal.setAppElement("#root");

const PredictionModal = ({
  isOpen,
  onRequestClose,
  children,
  contentLabel = "Modal",
  style,
}) => {
  // Default styles for the modal
  const defaultStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 9999999
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "1px solid #ccc",
      background: "#fff",
      overflow: "auto",
      WebkitOverflowScrolling: "touch",
      borderRadius: "4px",
      outline: "none",
      padding: "20px",
    },
  };

  // Merge default styles with custom styles if provided
  const modalStyles = style ? { ...defaultStyles, ...style } : defaultStyles;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      style={modalStyles}
    >
      {children}
    </ReactModal>
  );
};

export default PredictionModal;
