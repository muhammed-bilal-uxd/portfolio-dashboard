import React from "react";
import "./Modal.css";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  modelStyle = {},
  modalClassName = "",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal ${modalClassName}`.trim()} style={modelStyle}>
        <div className="modal-header">
          <div className="modal-title">
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
