const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/role");
const { categoryValidator } = require("../middleware/validator");

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", protect, isAdmin, categoryValidator, createCategory);
router.put("/:id", protect, isAdmin, updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

module.exports = router;
