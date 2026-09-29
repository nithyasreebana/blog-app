import React from "react";

export const Loader = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "3px solid #e2e8f0",
          borderTopColor: "var(--primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {message && (
        <p style={{ marginTop: "14px", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>
          {message}
        </p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {content}
      </div>
    );
  }

  return content;
};

export const CardSkeleton = () => (
  <div className="card" style={{ padding: 0, overflow: "hidden" }}>
    <div style={{ height: "200px", backgroundColor: "#f1f5f9" }} />
    <div style={{ padding: "20px" }}>
      <div style={{ height: "16px", width: "40%", backgroundColor: "#e2e8f0", borderRadius: "4px", marginBottom: "12px" }} />
      <div style={{ height: "22px", width: "80%", backgroundColor: "#e2e8f0", borderRadius: "4px", marginBottom: "10px" }} />
      <div style={{ height: "14px", width: "100%", backgroundColor: "#f1f5f9", borderRadius: "4px", marginBottom: "6px" }} />
      <div style={{ height: "14px", width: "90%", backgroundColor: "#f1f5f9", borderRadius: "4px" }} />
    </div>
  </div>
);

export default Loader;
