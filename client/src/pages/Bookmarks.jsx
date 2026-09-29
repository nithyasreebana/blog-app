import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import PostList from "../components/blog/PostList";
import Alert from "../components/common/Alert";

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const res = await API.get("/users/bookmarks");
        if (res.data?.success) {
          // Set isBookmarked to true for each item
          const mapped = res.data.data.map((post) => ({
            ...post,
            isBookmarked: true,
          }));
          setBookmarks(mapped);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = (isBookmarked, blogId) => {
    if (!isBookmarked) {
      setBookmarks((prev) => prev.filter((p) => p._id !== blogId));
    }
  };

  return (
    <div className="main-content">
      <div className="container">
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "6px" }}>
            Reading List & Bookmarks
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Stories you've saved to read later.
          </p>
        </div>

        {error && <Alert message={error} onClose={() => setError(null)} />}

        <PostList
          posts={bookmarks}
          loading={loading}
          emptyMessage="Your reading list is empty."
          onBookmarkToggle={(isBookmarked, post) => handleBookmarkToggle(isBookmarked, post?._id)}
        />

        {!loading && bookmarks.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/" className="btn btn-primary btn-sm">
              Explore Stories to Save
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
