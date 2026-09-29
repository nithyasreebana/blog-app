const Blog = require("../models/blog");
const Comment = require("../models/comment");
const Category = require("../models/category");
const User = require("../models/user");

// @desc    Get all blogs with pagination, search & filters
// @route   GET /api/blogs
// @access  Public (Optional auth for like/bookmark state)
const getBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const query = {};

    // Search by title, body, or tags
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [
        { title: searchRegex },
        { body: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Filter by category (id or slug)
    if (req.query.category && req.query.category !== "all") {
      let categoryId = req.query.category;
      if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        const cat = await Category.findOne({ slug: req.query.category });
        if (cat) categoryId = cat._id;
      }
      query.category = categoryId;
    }

    // Filter by tag
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // Filter by author
    if (req.query.author) {
      query.createdBy = req.query.author;
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate("createdBy", "fullName profileImageURL bio role")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Map like and bookmark states if user is authenticated
    const currentUserId = req.user ? req.user._id.toString() : null;
    let userBookmarks = [];
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId).select("bookmarks").lean();
      userBookmarks = currentUser?.bookmarks ? currentUser.bookmarks.map((b) => b.toString()) : [];
    }

    const transformedBlogs = blogs.map((blog) => {
      const likesArray = (blog.likes || []).map((id) => id.toString());
      return {
        ...blog,
        likesCount: likesArray.length,
        isLiked: currentUserId ? likesArray.includes(currentUserId) : false,
        isBookmarked: currentUserId ? userBookmarks.includes(blog._id.toString()) : false,
      };
    });

    return res.status(200).json({
      success: true,
      data: transformedBlogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public (Optional auth for like/bookmark state)
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("createdBy", "fullName profileImageURL bio role")
      .populate("category", "name slug description")
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const currentUserId = req.user ? req.user._id.toString() : null;
    const likesArray = (blog.likes || []).map((id) => id.toString());

    let isBookmarked = false;
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId).select("bookmarks").lean();
      isBookmarked = currentUser?.bookmarks
        ? currentUser.bookmarks.some((b) => b.toString() === blog._id.toString())
        : false;
    }

    const transformedBlog = {
      ...blog,
      likesCount: likesArray.length,
      isLiked: currentUserId ? likesArray.includes(currentUserId) : false,
      isBookmarked,
    };

    return res.status(200).json({
      success: true,
      data: transformedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res, next) => {
  try {
    const { title, body, category } = req.body;
    let tags = [];

    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      } else if (typeof req.body.tags === "string") {
        tags = req.body.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    let coverImageURL = "";
    if (req.file) {
      coverImageURL = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.create({
      title,
      body,
      category: category && category !== "" ? category : null,
      tags,
      coverImageURL,
      createdBy: req.user._id,
    });

    const populatedBlog = await Blog.findById(blog._id)
      .populate("createdBy", "fullName profileImageURL bio role")
      .populate("category", "name slug");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: populatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private (Owner or Admin)
const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Role check: Admin or author
    const isOwner = blog.createdBy.toString() === req.user._id.toString();
    const isAdmin = (req.user.role || "").toLowerCase() === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this post",
      });
    }

    const { title, body, category } = req.body;

    if (title) blog.title = title;
    if (body) blog.body = body;
    if (category !== undefined) {
      blog.category = category && category !== "" ? category : null;
    }

    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) {
        blog.tags = req.body.tags;
      } else if (typeof req.body.tags === "string") {
        blog.tags = req.body.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    if (req.file) {
      blog.coverImageURL = `/uploads/${req.file.filename}`;
    }

    await blog.save();

    const updatedBlog = await Blog.findById(blog._id)
      .populate("createdBy", "fullName profileImageURL bio role")
      .populate("category", "name slug");

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Owner or Admin)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isOwner = blog.createdBy.toString() === req.user._id.toString();
    const isAdmin = (req.user.role || "").toLowerCase() === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    // Cascade delete: remove comments and user bookmarks
    await Comment.deleteMany({ blogId: blog._id });
    await User.updateMany(
      { bookmarks: blog._id },
      { $pull: { bookmarks: blog._id } }
    );
    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on a post
// @route   POST /api/blogs/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userIdStr = req.user._id.toString();
    const isLiked = blog.likes.some((id) => id.toString() === userIdStr);

    if (isLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userIdStr);
    } else {
      blog.likes.push(req.user._id);
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      message: isLiked ? "Post unliked" : "Post liked",
      likesCount: blog.likes.length,
      isLiked: !isLiked,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
};
