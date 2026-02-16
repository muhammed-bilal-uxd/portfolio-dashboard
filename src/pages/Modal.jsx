import React from "react";

const Modal = ({ isOpen, onClose, children, theme }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, background: theme.modelBg }}>
        <button
          style={{ ...closeBtnStyle, color: theme.text }}
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  position: "relative",
};

const closeBtnStyle = {
  position: "absolute",
  top: "10px",
  right: "15px",
  border: "none",
  background: "transparent",
  fontSize: "25px",
  cursor: "pointer",
  padding: 0,
  outline: "none",
};

export default Modal;
