import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import CommentForm from "./CommentForm";

export const CommentItem = ({ comment, onUpdate, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!comment) return null;

  const isAuthor = user && comment.createdBy?._id === user._id;
  const canDelete = isAuthor || isAdmin;
  const canEdit = isAuthor;

  const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleUpdate = async (newContent) => {
    await onUpdate(comment._id, newContent);
    setIsEditing(false);
  };

  return (
    <div className="comment-card">
      <div className="comment-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar
            src={comment.createdBy?.profileImageURL}
            alt={comment.createdBy?.fullName || "User"}
            size="sm"
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-main)" }}>
                {comment.createdBy?.fullName || "User"}
              </span>
              {comment.createdBy?.role?.toLowerCase() === "admin" && (
                <Badge variant="admin">Admin</Badge>
              )}
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
              {formattedDate}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline btn-sm"
              style={{ padding: "3px 8px", fontSize: "0.78rem" }}
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(comment._id)}
              className="btn btn-danger btn-sm"
              style={{ padding: "3px 8px", fontSize: "0.78rem" }}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <CommentForm
          initialContent={comment.content}
          isEditing={true}
          buttonText="Save Changes"
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p style={{ fontSize: "0.92rem", color: "var(--text-main)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
          {comment.content}
        </p>
      )}
    </div>
  );
};

export default CommentItem;
