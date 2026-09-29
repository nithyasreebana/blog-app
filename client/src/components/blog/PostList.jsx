import React from "react";
import PostCard from "./PostCard";
import { CardSkeleton } from "../common/Loader";

export const PostList = ({
  posts = [],
  loading = false,
  emptyMessage = "No stories found.",
  onLikeToggle,
  onBookmarkToggle,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="posts-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "var(--bg-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--border-light)",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-light)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ margin: "0 auto 16px" }}
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "6px" }}>
          {emptyMessage}
        </h3>
        <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
          Try adjusting your search filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLikeToggle={onLikeToggle}
          onBookmarkToggle={onBookmarkToggle}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PostList;
