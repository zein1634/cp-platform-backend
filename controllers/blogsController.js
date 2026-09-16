import { Blog } from "../schemas.js";
import mongoose from "mongoose";
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isDeleted: false }).limit(10);
    return res.status(200).send(blogs);
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const getBlogById = async (req, res) => {
  try {
    const id = req.params.blogId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("invalid id");
    }
    const blog = await Blog.findById(id).populate({
      path: "comments",
      match: { isDeleted: false },
    });
    if (!blog || blog.isDeleted) {
      return res.status(404).send("blog not found");
    }
    return res.status(200).send(blog);
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const postBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).send("title and content cant be empty");
    }
    const user = req.user;
    await Blog.create({
      title: title,
      content: content,
      authorId: user._id,
    });
    return res.status(201).send("blog has been posted successfully");
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const id = req.params.blogId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("invalid id");
    }
    const blog = req.blog;
    blog.isDeleted = true;
    await blog.save();
    return res.status(200).send("blog has been deleted successfully");
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const updateBlog = async (req, res) => {
  try {
    const id = req.params.blogId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("invalid id");
    }
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).send("title and content cant be empty");
    }
    const blog = req.blog;
    blog.title = title;
    blog.content = content;
    await blog.save();
    return res.status(200).send("blog has been updated successfully");
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};
