const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getUserById,
  updateUserProfile,
  getUserPosts,
  toggleBookmark,
  getBookmarks,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { uploadAvatar } = require("../middleware/upload");
const { profileValidator } = require("../middleware/validator");

// Current user profile & bookmarks
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, uploadAvatar, profileValidator, updateUserProfile);
router.get("/bookmarks", protect, getBookmarks);
router.post("/bookmarks/:blogId", protect, toggleBookmark);

// Public profile & user's posts
router.get("/:id/posts", getUserPosts);
router.get("/:id", getUserById);

// Admin user management
router.get("/", protect, isAdmin, getAllUsers);
router.delete("/:id", protect, isAdmin, deleteUser);

module.exports = router;
