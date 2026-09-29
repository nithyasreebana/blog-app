const User = require("../models/user");
const Blog = require("../models/blog");

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password -salt");
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public profile of any user by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("fullName bio profileImageURL role createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const postCount = await Blog.countDocuments({ createdBy: user._id });

    return res.status(200).json({
      success: true,
      data: {
        ...user,
        postCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile (name, bio, avatar)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.body.fullName) user.fullName = req.body.fullName.trim();
    if (req.body.bio !== undefined) user.bio = req.body.bio.trim();

    if (req.file) {
      user.profileImageURL = `/uploads/${req.file.filename}`;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password -salt");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts created by a specific user
// @route   GET /api/users/:id/posts
// @access  Public
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments({ createdBy: id });
    const posts = await Blog.find({ createdBy: id })
      .populate("category", "name slug")
      .populate("createdBy", "fullName profileImageURL")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark for a post
// @route   POST /api/users/bookmarks/:blogId
// @access  Private
const toggleBookmark = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const user = await User.findById(req.user._id);
    const blogIdStr = blogId.toString();
    const isBookmarked = (user.bookmarks || []).some(
      (b) => b.toString() === blogIdStr
    );

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (b) => b.toString() !== blogIdStr
      );
    } else {
      user.bookmarks.push(blog._id);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: isBookmarked ? "Post removed from bookmarks" : "Post added to bookmarks",
      isBookmarked: !isBookmarked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookmarked posts
// @route   GET /api/users/bookmarks
// @access  Private
const getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "bookmarks",
        populate: [
          { path: "createdBy", select: "fullName profileImageURL role" },
          { path: "category", select: "name slug" },
        ],
      })
      .lean();

    // Filter out any deleted posts that were null
    const validBookmarks = (user.bookmarks || []).filter(Boolean);

    return res.status(200).json({
      success: true,
      count: validBookmarks.length,
      data: validBookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -salt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin" && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete their own account",
      });
    }

    await Blog.deleteMany({ createdBy: user._id });
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User and associated posts deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  getUserById,
  updateUserProfile,
  getUserPosts,
  toggleBookmark,
  getBookmarks,
  getAllUsers,
  deleteUser,
};
