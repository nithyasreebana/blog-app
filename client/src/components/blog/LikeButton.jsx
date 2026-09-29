import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

export const LikeButton = ({ blogId, initialLikesCount = 0, initialIsLiked = false, onToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    if (loading) return;
    setLoading(true);

    // Optimistic UI update
    const previousLiked = isLiked;
    const previousCount = likesCount;
    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      const res = await API.post(`/blogs/${blogId}/like`);
      if (res.data?.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
        if (onToggle) onToggle(res.data.isLiked, res.data.likesCount);
      }
    } catch (err) {
      // Revert if API fails
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      className="btn btn-outline btn-sm"
      style={{
        padding: "6px 12px",
        borderColor: isLiked ? "#fca5a5" : "var(--border-light)",
        backgroundColor: isLiked ? "var(--accent-red-light)" : "transparent",
        color: isLiked ? "var(--accent-red)" : "var(--text-muted)",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
      title={isLiked ? "Unlike post" : "Like post"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isLiked ? "var(--accent-red)" : "none"}
        stroke={isLiked ? "var(--accent-red)" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;
