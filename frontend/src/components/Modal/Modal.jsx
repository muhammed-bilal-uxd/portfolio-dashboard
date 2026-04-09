import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, children, title, modelStyle = {} }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" style={modelStyle}>
        <div style={{ display: "flex", paddingBottom: "10px" }}>
          <div
            style={{ flex: 1, textTransform: "capitalize", fontWeight: "bold" }}
          >
            {title || "no title"}
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
