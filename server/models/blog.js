const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String,
      default: "",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for query performance and text search
blogSchema.index({ title: "text", body: "text", tags: "text" });
blogSchema.index({ category: 1 });
blogSchema.index({ createdBy: 1 });
blogSchema.index({ createdAt: -1 });

const Blog = model("blog", blogSchema);
module.exports = Blog;
