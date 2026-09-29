import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const CommentForm = ({ onSubmit, initialContent = "", isEditing = false, onCancel, buttonText = "Post Comment" }) => {
  const { user } = useAuth();
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user && !isEditing) {
    return (
      <div
        style={{
          padding: "16px 20px",
          backgroundColor: "var(--bg-subtle)",
          borderRadius: "var(--radius-sm)",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "var(--text-muted)",
        }}
      >
        Please{" "}
        <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
          log in
        </Link>{" "}
        or{" "}
        <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
          create an account
        </Link>{" "}
        to leave a comment.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await onSubmit(content.trim());
      if (!isEditing) setContent("");
    } catch (err) {
      setError(err.message || "Failed to submit comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
      <div className="form-group" style={{ marginBottom: "12px" }}>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError("");
          }}
          placeholder="Share your thoughts on this story..."
          className={`form-textarea ${error ? "is-invalid" : ""}`}
        />
        {error && <div className="form-error">{error}</div>}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="btn btn-outline btn-sm"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="btn btn-primary btn-sm"
        >
          {submitting ? "Submitting..." : buttonText}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
