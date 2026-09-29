import React, { useEffect } from "react";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Confirm",
  onConfirm,
  confirmVariant = "primary",
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.3rem",
                cursor: "pointer",
                color: "var(--text-muted)",
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ marginBottom: "24px", color: "var(--text-muted)", fontSize: "0.95rem" }}>
          {children}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="btn btn-outline btn-sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          {onConfirm && (
            <button
              className={`btn btn-${confirmVariant} btn-sm`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
