import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/common/Avatar";
import Badge from "../components/common/Badge";
import Alert from "../components/common/Alert";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import LikeButton from "../components/blog/LikeButton";
import BookmarkButton from "../components/blog/BookmarkButton";
import CommentForm from "../components/comment/CommentForm";
import CommentList from "../components/comment/CommentList";

export const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete Post Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Delete Comment Modal state
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const [postRes, commentsRes] = await Promise.all([
          API.get(`/blogs/${id}`),
          API.get(`/blogs/${id}/comments`),
        ]);

        if (postRes.data?.success) {
          setPost(postRes.data.data);
        }
        if (commentsRes.data?.success) {
          setComments(commentsRes.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleAddComment = async (content) => {
    try {
      const res = await API.post(`/blogs/${id}/comments`, { content });
      if (res.data?.success) {
        setComments((prev) => [res.data.data, ...prev]);
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to submit comment.");
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const res = await API.put(`/blogs/${id}/comments/${commentId}`, { content });
      if (res.data?.success) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? res.data.data : c))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteCommentConfirm = async () => {
    if (!commentToDelete) return;
    try {
      const res = await API.delete(`/blogs/${id}/comments/${commentToDelete}`);
      if (res.data?.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment");
    } finally {
      setCommentToDelete(null);
    }
  };

  const handleDeletePost = async () => {
    setDeleting(true);
    try {
      const res = await API.delete(`/blogs/${id}`);
      if (res.data?.success) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading story..." />;
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <Alert message={error || "Post not found."} />
        <Link to="/" className="btn btn-outline" style={{ marginTop: "16px" }}>
          ← Back to All Stories
        </Link>
      </div>
    );
  }

  const isAuthor = user && (post.createdBy?._id === user._id || post.createdBy === user._id);
  const canManage = isAuthor || isAdmin;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="main-content">
      <article className="container" style={{ maxWidth: "820px" }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "20px" }}>
          <Link
            to="/"
            style={{
              fontSize: "0.88rem",
              color: "var(--text-muted)",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ← Back to Stories
          </Link>
        </div>

        {/* Post Category & Date */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          {post.category && <Badge variant="primary">{post.category.name}</Badge>}
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{formattedDate}</span>
        </div>

        {/* Post Title */}
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            lineHeight: 1.25,
            color: "var(--text-main)",
            letterSpacing: "-0.02em",
            marginBottom: "24px",
          }}
        >
          {post.title}
        </h1>

        {/* Author Header & Actions Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 0",
            borderTop: "1px solid var(--border-light)",
            borderBottom: "1px solid var(--border-light)",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              src={post.createdBy?.profileImageURL}
              alt={post.createdBy?.fullName || "Author"}
              size="md"
            />
            <div>
              <Link
                to={`/users/${post.createdBy?._id}`}
                style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}
              >
                {post.createdBy?.fullName || "Anonymous Author"}
              </Link>
              {post.createdBy?.bio && (
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                  {post.createdBy.bio}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <LikeButton
              blogId={post._id}
              initialLikesCount={post.likesCount || post.likes?.length || 0}
              initialIsLiked={post.isLiked || false}
            />
            <BookmarkButton
              blogId={post._id}
              initialIsBookmarked={post.isBookmarked || false}
            />

            {canManage && (
              <div style={{ display: "flex", gap: "8px", marginLeft: "8px" }}>
                <Link to={`/edit-post/${post._id}`} className="btn btn-outline btn-sm">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImageURL && (
          <div style={{ marginBottom: "32px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <img
              src={post.coverImageURL}
              alt={post.title}
              style={{
                width: "100%",
                maxHeight: "440px",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        {/* Post Content */}
        <div
          style={{
            fontSize: "1.08rem",
            lineHeight: 1.8,
            color: "var(--text-main)",
            marginBottom: "40px",
            whiteSpace: "pre-wrap",
          }}
        >
          {post.body}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "40px" }}>
            {post.tags.map((tag, idx) => (
              <Link
                key={idx}
                to={`/?search=${encodeURIComponent(tag)}`}
                style={{
                  fontSize: "0.85rem",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--bg-subtle)",
                  color: "var(--primary)",
                  fontWeight: 500,
                }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <section className="comments-container" style={{ borderTop: "1px solid var(--border-light)", paddingTop: "32px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "20px" }}>
            Discussion ({comments.length})
          </h2>

          <CommentForm onSubmit={handleAddComment} />

          <CommentList
            comments={comments}
            onUpdate={handleUpdateComment}
            onDelete={(commentId) => setCommentToDelete(commentId)}
          />
        </section>
      </article>

      {/* Delete Post Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Post"
        confirmText="Yes, Delete Post"
        confirmVariant="danger"
        isLoading={deleting}
        onConfirm={handleDeletePost}
      >
        Are you sure you want to permanently delete this story? This action cannot be undone and will delete all associated comments.
      </Modal>

      {/* Delete Comment Confirmation Modal */}
      <Modal
        isOpen={Boolean(commentToDelete)}
        onClose={() => setCommentToDelete(null)}
        title="Delete Comment"
        confirmText="Delete Comment"
        confirmVariant="danger"
        onConfirm={handleDeleteCommentConfirm}
      >
        Are you sure you want to delete this comment?
      </Modal>
    </div>
  );
};

export default PostDetails;
