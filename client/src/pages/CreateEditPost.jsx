import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import FormInput from "../components/forms/FormInput";
import FormTextarea from "../components/forms/FormTextarea";
import ImageUploadPreview from "../components/forms/ImageUploadPreview";
import Alert from "../components/common/Alert";
import Loader from "../components/common/Loader";

export const CreateEditPost = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState("");

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [globalError, setGlobalError] = useState(null);

  // Load categories and existing post (if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await API.get("/categories");
        if (catRes.data?.success) {
          setCategories(catRes.data.data);
        }

        if (isEditing) {
          const postRes = await API.get(`/blogs/${id}`);
          if (postRes.data?.success) {
            const p = postRes.data.data;
            setTitle(p.title || "");
            setBody(p.body || "");
            setCategory(p.category?._id || p.category || "");
            setTags(p.tags ? p.tags.join(", ") : "");
            setExistingCoverUrl(p.coverImageURL || "");
          }
        }
      } catch (err) {
        setGlobalError(err.response?.data?.message || "Failed to load story details.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = "Title is required.";
    } else if (title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters long.";
    }

    if (!body.trim()) {
      errs.body = "Story content is required.";
    } else if (body.trim().length < 5) {
      errs.body = "Story content must be at least 5 characters long.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setGlobalError(null);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("body", body.trim());
    if (category) formData.append("category", category);
    if (tags.trim()) formData.append("tags", tags.trim());
    if (coverImageFile) formData.append("coverImage", coverImageFile);

    try {
      let res;
      if (isEditing) {
        res = await API.put(`/blogs/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await API.post("/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data?.success) {
        const targetId = res.data.data._id || id;
        navigate(`/posts/${targetId}`);
      }
    } catch (err) {
      setGlobalError(err.response?.data?.message || "Failed to save story. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return <Loader fullScreen message="Loading editor..." />;
  }

  return (
    <div className="main-content">
      <div className="container" style={{ maxWidth: "780px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>
            {isEditing ? "Edit Story" : "Publish a New Story"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {isEditing
              ? "Make updates to your published article."
              : "Share your knowledge, tutorials, or experiences with the world."}
          </p>
        </div>

        {globalError && <Alert message={globalError} onClose={() => setGlobalError(null)} />}

        <div className="card" style={{ padding: "32px 28px" }}>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Story Title"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Building Scalable Web Apps with React & Node.js"
              required
              error={errors.title}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select a category (optional)</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <FormInput
                label="Tags"
                id="tags"
                name="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tech, javascript, tutorial"
                hint="Comma-separated values"
              />
            </div>

            <ImageUploadPreview
              label="Cover Image"
              currentImage={existingCoverUrl}
              onImageChange={(file) => setCoverImageFile(file)}
              hint="Max 5MB (PNG, JPG, WEBP)"
            />

            <FormTextarea
              label="Story Content"
              id="body"
              name="body"
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your article here..."
              required
              error={errors.body}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                {submitting ? "Publishing..." : isEditing ? "Save Changes" : "Publish Story"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEditPost;
