import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Avatar from "../components/common/Avatar";
import Badge from "../components/common/Badge";
import FormInput from "../components/forms/FormInput";
import FormTextarea from "../components/forms/FormTextarea";
import ImageUploadPreview from "../components/forms/ImageUploadPreview";
import PostList from "../components/blog/PostList";
import Alert from "../components/common/Alert";
import SuccessMessage from "../components/common/SuccessMessage";
import Modal from "../components/common/Modal";

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("posts"); // "posts" | "edit"
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Edit form state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Delete Post Modal state
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setBio(user.bio || "");
    }
  }, [user]);

  // Fetch posts written by current user
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?._id) return;
      setPostsLoading(true);
      try {
        const res = await API.get(`/users/${user._id}/posts`);
        if (res.data?.success) {
          setUserPosts(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load user posts", err);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user?._id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Full name cannot be empty.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("bio", bio.trim());
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await API.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        updateUser(res.data.data);
        setSuccessMsg("Profile updated successfully!");
        setAvatarFile(null);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePostConfirm = async () => {
    if (!postToDelete) return;
    setDeleting(true);
    try {
      const res = await API.delete(`/blogs/${postToDelete}`);
      if (res.data?.success) {
        setUserPosts((prev) => prev.filter((p) => p._id !== postToDelete));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
      setPostToDelete(null);
    }
  };

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: "860px" }}>
        {/* Profile Header Card */}
        <div
          className="card"
          style={{
            padding: "32px",
            marginBottom: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Avatar
            src={user?.profileImageURL}
            alt={user?.fullName || "User"}
            size="xl"
            style={{ marginBottom: "16px" }}
          />

          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "4px" }}>
            {user?.fullName}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{user?.email}</span>
            {user?.role?.toLowerCase() === "admin" && <Badge variant="admin">Administrator</Badge>}
          </div>

          {user?.bio && (
            <p style={{ maxWidth: "560px", color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              {user.bio}
            </p>
          )}

          {/* Navigation Tabs */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "24px",
              borderBottom: "1px solid var(--border-light)",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => setActiveTab("posts")}
              className={`btn btn-sm ${activeTab === "posts" ? "btn-primary" : "btn-secondary"}`}
              style={{ borderRadius: "var(--radius-full)" }}
            >
              My Stories ({userPosts.length})
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`btn btn-sm ${activeTab === "edit" ? "btn-primary" : "btn-secondary"}`}
              style={{ borderRadius: "var(--radius-full)" }}
            >
              ⚙️ Edit Profile
            </button>
          </div>
        </div>

        {successMsg && <SuccessMessage message={successMsg} onClose={() => setSuccessMsg(null)} />}
        {errorMsg && <Alert message={errorMsg} onClose={() => setErrorMsg(null)} />}

        {/* Tab 1: User's Published Stories */}
        {activeTab === "posts" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Your Published Stories</h2>
              <Link to="/create-post" className="btn btn-primary btn-sm">
                + Write New Story
              </Link>
            </div>

            <PostList
              posts={userPosts}
              loading={postsLoading}
              emptyMessage="You haven't written any stories yet."
              showActions={true}
              onEdit={(post) => navigate(`/edit-post/${post._id}`)}
              onDelete={(postId) => setPostToDelete(postId)}
            />
          </div>
        )}

        {/* Tab 2: Edit Profile Form */}
        {activeTab === "edit" && (
          <div className="card" style={{ padding: "32px 28px" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px" }}>
              Edit Account Profile
            </h2>

            <form onSubmit={handleUpdateProfile}>
              <FormInput
                label="Full Name"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <FormTextarea
                label="Bio"
                id="bio"
                name="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short description about yourself, what you write about, etc."
              />

              <ImageUploadPreview
                label="Profile Picture"
                currentImage={user?.profileImageURL}
                onImageChange={(file) => setAvatarFile(file)}
                hint="PNG or JPG up to 5MB"
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("posts")}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Delete Post Modal */}
      <Modal
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        title="Delete Story"
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={deleting}
        onConfirm={handleDeletePostConfirm}
      >
        Are you sure you want to delete this story? This will permanently remove the story and its comments.
      </Modal>
    </div>
  );
};

export default Profile;
