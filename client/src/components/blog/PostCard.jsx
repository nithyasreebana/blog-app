import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";

export const PostCard = ({ post, onLikeToggle, onBookmarkToggle, showActions = false, onEdit, onDelete }) => {
  if (!post) return null;

  const defaultCover =
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";

  const coverSrc = post.coverImageURL
    ? post.coverImageURL.startsWith("http")
      ? post.coverImageURL
      : post.coverImageURL
    : defaultCover;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="card post-card">
      <Link to={`/posts/${post._id}`}>
        <img
          src={coverSrc}
          alt={post.title}
          className="post-card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultCover;
          }}
        />
      </Link>

      <div className="post-card-body">
        <div className="post-card-meta">
          {post.category && (
            <Badge variant="primary">{post.category.name || "Story"}</Badge>
          )}
          <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
            {formattedDate}
          </span>
        </div>

        <Link to={`/posts/${post._id}`}>
          <h2 className="post-card-title">{post.title}</h2>
        </Link>

        <p className="post-card-excerpt">
          {post.body ? post.body.replace(/<[^>]*>?/gm, "").substring(0, 140) + "..." : ""}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
            {post.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  backgroundColor: "var(--bg-subtle)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-card-footer">
          <div className="post-author">
            <Avatar
              src={post.createdBy?.profileImageURL}
              alt={post.createdBy?.fullName || "Author"}
              size="sm"
            />
            <span style={{ fontWeight: 600, fontSize: "0.84rem" }}>
              {post.createdBy?.fullName || "Anonymous"}
            </span>
          </div>

          <div className="post-stats">
            <LikeButton
              blogId={post._id}
              initialLikesCount={post.likesCount || post.likes?.length || 0}
              initialIsLiked={post.isLiked || false}
              onToggle={onLikeToggle}
            />
            <BookmarkButton
              blogId={post._id}
              initialIsBookmarked={post.isBookmarked || false}
              onToggle={onBookmarkToggle}
            />
          </div>
        </div>

        {showActions && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "12px",
              paddingTop: "10px",
              borderTop: "1px dashed var(--border-light)",
            }}
          >
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(post)}
                className="btn btn-secondary btn-sm"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(post._id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
