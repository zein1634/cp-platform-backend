import { Comment, Blog } from "../schemas.js";
import mongoose from "mongoose";

export const postComment = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const user = req.user;
    const { content } = req.body;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send("invalid id");
    }
    const blog = await Blog.findById(blogId);
    if (!blog || blog.isDeleted) {
      return res.status(404).send("blog not found");
    }
    if (!content) {
      return res.status(400).send("comment cant be empty");
    }
    const comment = await Comment.create({
      targetId: blogId,
      content: content,
      authorId: user._id,
    });
    return res.status(201).send("comment has been posted successfully");
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("invalid id");
    }
    const comment = req.comment;
    comment.isDeleted = true;
    await comment.save();
    return res.status(200).send("comment has been deleted successfully");
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("invalid id");
    }
    if (!content) {
      return res.status(400).send("comment cant be empty");
    }
    const comment = req.comment;
    comment.content = content;
    await comment.save();
    return res.status(200).send("comment has been edited successfully");
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};
