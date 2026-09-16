import mongoose from "mongoose";
import { User, Blog, Comment } from "../schemas.js";
export const isRated = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.rating === null) {
      return res.status(403).send("user must be rated to post blogs");
    }
    next();
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const isStaff = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "staff") {
      return res.status(403).send("staff access required");
    }
    next();
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const isAllowedToModifyBlog = async (req, res, next) => {
  try {
    const user = req.user;
    const blogId = req.params.blogId;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send("invalid blog id");
    }
    const blog = await Blog.findById(blogId);
    if (!blog || blog.isDeleted) {
      return res.status(404).send("blog not found");
    }
    if (user.role !== "staff" && user._id !== blog.authorId.toString()) {
      return res
        .status(403)
        .send(
          "you must be the author of the blog to be able to modify or delete it",
        );
    }
    req.blog = blog;
    next();
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const isAllowedToModifyComment = async (req, res, next) => {
  try {
    const user = req.user;
    const commentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).send("invalid comment id");
    }
    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted) {
      return res.status(404).send("comment not found");
    }
    if (user.role !== "staff" && user._id !== comment.authorId.toString()) {
      return res
        .status(403)
        .send(
          "u must be the author of the comment to be able to modify or delete it",
        );
    }
    req.comment = comment;
    next();
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};
