import React from "react";

export const Alert = ({ message, type = "error", onClose }) => {
  if (!message) return null;

  const alertClass = {
    error: "alert alert-error",
    success: "alert alert-success",
    info: "alert alert-info",
  }[type] || "alert alert-error";

  return (
    <div className={alertClass} role="alert">
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            color: "inherit",
          }}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
