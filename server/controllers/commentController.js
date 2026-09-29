const Comment = require("../models/comment");
const Blog = require("../models/blog");

// @desc    Get comments for a blog post
// @route   GET /api/blogs/:blogId/comments
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blogId })
      .populate("createdBy", "fullName profileImageURL role")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to a blog post
// @route   POST /api/blogs/:blogId/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      content,
      blogId,
      createdBy: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("createdBy", "fullName profileImageURL role");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a comment
// @route   PUT /api/blogs/:blogId/comments/:commentId
// @access  Private (Owner only)
const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Only original author can edit comment
    if (comment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments",
      });
    }

    comment.content = content;
    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate("createdBy", "fullName profileImageURL role");

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/blogs/:blogId/comments/:commentId
// @access  Private (Owner or Admin)
const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const isOwner = comment.createdBy.toString() === req.user._id.toString();
    const isAdmin = (req.user.role || "").toLowerCase() === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComments,
  addComment,
  updateComment,
  deleteComment,
};
