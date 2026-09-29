import React, { useState, useEffect } from "react";

export const ImageUploadPreview = ({
  label = "Upload Image",
  currentImage,
  onImageChange,
  name = "image",
  maxSizeMB = 5,
  hint = "PNG, JPG, or WEBP up to 5MB",
  error,
}) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (currentImage && !preview) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileChange = (e) => {
    setLocalError(null);
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setLocalError("Only image files are supported.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onImageChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setLocalError(null);
    onImageChange(null);
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      {preview ? (
        <div style={{ position: "relative", marginBottom: "12px", maxWidth: "360px" }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              height: "190px",
              objectFit: "cover",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-light)",
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
            title="Remove Image"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          style={{
            border: "2px dashed var(--border-light)",
            borderRadius: "var(--radius-sm)",
            padding: "24px 16px",
            textAlign: "center",
            backgroundColor: "var(--bg-subtle)",
            marginBottom: "8px",
            cursor: "pointer",
          }}
          onClick={() => document.getElementById(`file-input-${name}`).click()}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: "0 auto 8px" }}
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-main)" }}>
            Click to upload an image
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{hint}</p>
        </div>
      )}

      <input
        id={`file-input-${name}`}
        type="file"
        name={name}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {(localError || error) && (
        <div className="form-error">{localError || error}</div>
      )}
    </div>
  );
};

export default ImageUploadPreview;
