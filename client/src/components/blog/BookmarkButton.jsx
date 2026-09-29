import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

export const BookmarkButton = ({ blogId, initialIsBookmarked = false, onToggle }) => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    if (loading) return;
    setLoading(true);

    const prev = isBookmarked;
    setIsBookmarked(!prev);

    try {
      const res = await API.post(`/users/bookmarks/${blogId}`);
      if (res.data?.success) {
        setIsBookmarked(res.data.isBookmarked);
        // Sync context user bookmarks array
        const currentBookmarks = user.bookmarks || [];
        const updatedBookmarks = res.data.isBookmarked
          ? [...currentBookmarks, blogId]
          : currentBookmarks.filter((b) => (b._id || b).toString() !== blogId.toString());
        updateUser({ bookmarks: updatedBookmarks });

        if (onToggle) onToggle(res.data.isBookmarked);
      }
    } catch (err) {
      setIsBookmarked(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      className="btn btn-outline btn-sm"
      style={{
        padding: "6px 10px",
        borderColor: isBookmarked ? "var(--primary-border)" : "var(--border-light)",
        backgroundColor: isBookmarked ? "var(--primary-light)" : "transparent",
        color: isBookmarked ? "var(--primary)" : "var(--text-muted)",
        display: "inline-flex",
        alignItems: "center",
      }}
      title={isBookmarked ? "Remove bookmark" : "Save bookmark"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isBookmarked ? "var(--primary)" : "none"}
        stroke={isBookmarked ? "var(--primary)" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    </button>
  );
};

export default BookmarkButton;
