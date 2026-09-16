import express from "express";
import authMiddleware from "./middlewares/authenticationMiddleware.js";
import {
  isRated,
  isStaff,
  isAllowedToModifyBlog,
  isAllowedToModifyComment,
} from "./middlewares/authorizationMiddleware.js";
import {
  getProblems,
  getProblemById,
  postProblem,
} from "./controllers/problemController.js";
import {
  registerController,
  loginController,
  tokenController,
  logoutController,
} from "./controllers/authController.js";
import {
  getBlogs,
  getBlogById,
  postBlog,
  deleteBlog,
  updateBlog,
} from "./controllers/blogsController.js";

import {
  postComment,
  deleteComment,
  updateComment,
} from "./controllers/commentsController.js";

const router = express.Router();

router.get("/problemset", getProblems);

router.get("/problem/:id", getProblemById);

router.post("/problemset", authMiddleware,isStaff, postProblem);

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/auth/token", tokenController);

router.post("/auth/logout", logoutController);

router.get("/blogs", getBlogs);

router.get("/blog/:blogId", getBlogById);

router.post("/blogs", authMiddleware, isRated, postBlog);

router.delete(
  "/blog/:blogId",
  authMiddleware,
  isAllowedToModifyBlog,
  deleteBlog,
);

router.patch(
  "/blog/:blogId",
  authMiddleware,
  isAllowedToModifyBlog,
  updateBlog,
);

router.post("/blog/:blogId/comments", authMiddleware, postComment);

router.delete(
  "/comment/:id",
  authMiddleware,
  isAllowedToModifyComment,
  deleteComment,
);

router.patch(
  "/comment/:id",
  authMiddleware,
  isAllowedToModifyComment,
  updateComment,
);

export default router;
