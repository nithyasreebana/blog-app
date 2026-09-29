const express = require("express");
const router = express.Router();
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
} = require("../controllers/blogController");
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect, optionalAuth } = require("../middleware/auth");
const { uploadCover } = require("../middleware/upload");
const { postValidator, commentValidator } = require("../middleware/validator");

// Blog CRUD
router.get("/", optionalAuth, getBlogs);
router.get("/:id", optionalAuth, getBlogById);
router.post("/", protect, uploadCover, postValidator, createBlog);
router.put("/:id", protect, uploadCover, updateBlog);
router.delete("/:id", protect, deleteBlog);

// Likes
router.post("/:id/like", protect, toggleLike);

// Nested Comments
router.get("/:blogId/comments", getComments);
router.post("/:blogId/comments", protect, commentValidator, addComment);
router.put("/:blogId/comments/:commentId", protect, commentValidator, updateComment);
router.delete("/:blogId/comments/:commentId", protect, deleteComment);

module.exports = router;
