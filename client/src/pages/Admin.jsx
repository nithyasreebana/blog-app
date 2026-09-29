import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/common/Badge";
import Alert from "../components/common/Alert";
import SuccessMessage from "../components/common/SuccessMessage";
import Modal from "../components/common/Modal";
import FormInput from "../components/forms/FormInput";
import FormTextarea from "../components/forms/FormTextarea";
import Loader from "../components/common/Loader";

export const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("categories"); // "categories" | "posts" | "users"

  // Data states
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Message states
  const [alertError, setAlertError] = useState(null);
  const [alertSuccess, setAlertSuccess] = useState(null);

  // Category Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  // Delete Action Modals
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'category'|'post'|'user', id: string, name: string }
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      if (res.data?.success) setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await API.get("/blogs?limit=50");
      if (res.data?.success) setPosts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      if (res.data?.success) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchPosts(), fetchUsers()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setSavingCategory(true);
    setAlertError(null);
    try {
      const res = await API.post("/categories", {
        name: newCatName.trim(),
        description: newCatDesc.trim(),
      });
      if (res.data?.success) {
        setAlertSuccess("Category created successfully!");
        setNewCatName("");
        setNewCatDesc("");
        setIsCategoryModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      setAlertError(err.response?.data?.message || "Failed to create category");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    setAlertError(null);

    try {
      if (itemToDelete.type === "category") {
        await API.delete(`/categories/${itemToDelete.id}`);
        setCategories((prev) => prev.filter((c) => c._id !== itemToDelete.id));
        setAlertSuccess("Category deleted successfully.");
      } else if (itemToDelete.type === "post") {
        await API.delete(`/blogs/${itemToDelete.id}`);
        setPosts((prev) => prev.filter((p) => p._id !== itemToDelete.id));
        setAlertSuccess("Post deleted successfully.");
      } else if (itemToDelete.type === "user") {
        await API.delete(`/users/${itemToDelete.id}`);
        setUsers((prev) => prev.filter((u) => u._id !== itemToDelete.id));
        setAlertSuccess("User deleted successfully.");
      }
    } catch (err) {
      setAlertError(err.response?.data?.message || "Failed to delete item.");
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading Admin Dashboard..." />;
  }

  return (
    <div className="main-content">
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>
              Admin Control Center
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Manage categories, moderate articles, and oversee user accounts.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              + Add Category
            </button>
          </div>
        </div>

        {alertSuccess && <SuccessMessage message={alertSuccess} onClose={() => setAlertSuccess(null)} />}
        {alertError && <Alert message={alertError} onClose={() => setAlertError(null)} />}

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            borderBottom: "1px solid var(--border-light)",
            marginBottom: "24px",
            overflowX: "auto",
          }}
        >
          <button
            onClick={() => setActiveTab("categories")}
            className={`btn btn-sm ${activeTab === "categories" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)" }}
          >
            Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`btn btn-sm ${activeTab === "posts" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)" }}
          >
            All Stories ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`btn btn-sm ${activeTab === "users" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)" }}
          >
            Users ({users.length})
          </button>
        </div>

        {/* Tab 1: Categories */}
        {activeTab === "categories" && (
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-subtle)", borderBottom: "1px solid var(--border-light)" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Category Name</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Slug</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Description</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Stories</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "14px 18px", fontWeight: 600 }}>{cat.name}</td>
                      <td style={{ padding: "14px 18px", color: "var(--text-muted)" }}>{cat.slug}</td>
                      <td style={{ padding: "14px 18px", color: "var(--text-muted)" }}>
                        {cat.description || "—"}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <Badge variant="primary">{cat.postCount || 0}</Badge>
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <button
                          onClick={() => setItemToDelete({ type: "category", id: cat._id, name: cat.name })}
                          className="btn btn-danger btn-sm"
                          style={{ padding: "4px 10px" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                        No categories found. Create your first category above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Posts Moderation */}
        {activeTab === "posts" && (
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-subtle)", borderBottom: "1px solid var(--border-light)" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Title</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Author</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Category</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Likes</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Published</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "14px 18px", fontWeight: 600, maxWidth: "280px" }}>
                        <Link to={`/posts/${p._id}`} style={{ color: "var(--primary)" }}>
                          {p.title}
                        </Link>
                      </td>
                      <td style={{ padding: "14px 18px" }}>{p.createdBy?.fullName || "—"}</td>
                      <td style={{ padding: "14px 18px" }}>
                        {p.category ? <Badge variant="primary">{p.category.name}</Badge> : "Uncategorized"}
                      </td>
                      <td style={{ padding: "14px 18px" }}>{p.likesCount || p.likes?.length || 0}</td>
                      <td style={{ padding: "14px 18px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <Link to={`/edit-post/${p._id}`} className="btn btn-outline btn-sm" style={{ padding: "4px 8px" }}>
                            Edit
                          </Link>
                          <button
                            onClick={() => setItemToDelete({ type: "post", id: p._id, name: p.title })}
                            className="btn btn-danger btn-sm"
                            style={{ padding: "4px 8px" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                        No stories published yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Users Management */}
        {activeTab === "users" && (
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-subtle)", borderBottom: "1px solid var(--border-light)" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Name</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Email</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Role</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700 }}>Registered</th>
                    <th style={{ padding: "14px 18px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = u._id === user?._id;
                    return (
                      <tr key={u._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                        <td style={{ padding: "14px 18px", fontWeight: 600 }}>{u.fullName}</td>
                        <td style={{ padding: "14px 18px", color: "var(--text-muted)" }}>{u.email}</td>
                        <td style={{ padding: "14px 18px" }}>
                          {u.role === "admin" ? <Badge variant="admin">Admin</Badge> : <Badge>User</Badge>}
                        </td>
                        <td style={{ padding: "14px 18px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "14px 18px", textAlign: "right" }}>
                          {!isSelf && (
                            <button
                              onClick={() => setItemToDelete({ type: "user", id: u._id, name: u.fullName })}
                              className="btn btn-danger btn-sm"
                              style={{ padding: "4px 10px" }}
                            >
                              Delete
                            </button>
                          )}
                          {isSelf && (
                            <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>Current User</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        <Modal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          title="Create New Category"
          confirmText="Create Category"
          isLoading={savingCategory}
          onConfirm={handleCreateCategory}
        >
          <form onSubmit={handleCreateCategory}>
            <FormInput
              label="Category Name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Technology, Design, Lifestyle"
              required
            />
            <FormTextarea
              label="Description (Optional)"
              rows={3}
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="Brief description of stories in this category..."
            />
          </form>
        </Modal>

        {/* Generic Delete Confirmation Modal */}
        <Modal
          isOpen={Boolean(itemToDelete)}
          onClose={() => setItemToDelete(null)}
          title={`Delete ${itemToDelete?.type}`}
          confirmText="Yes, Delete"
          confirmVariant="danger"
          isLoading={deleting}
          onConfirm={handleDeleteConfirm}
        >
          Are you sure you want to permanently delete "{itemToDelete?.name}"? This action cannot be reversed.
        </Modal>
      </div>
    </div>
  );
};

export default Admin;
