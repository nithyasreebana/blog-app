import React from "react";
import CommentItem from "./CommentItem";

export const CommentList = ({ comments = [], onUpdate, onDelete, loading = false }) => {
  if (loading) {
    return (
      <div style={{ padding: "20px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        Loading comments...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div
        style={{
          padding: "30px 16px",
          textAlign: "center",
          backgroundColor: "var(--bg-subtle)",
          borderRadius: "var(--radius-sm)",
          color: "var(--text-muted)",
          fontSize: "0.88rem",
        }}
      >
        No comments yet. Be the first to start the conversation!
      </div>
    );
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentList;
