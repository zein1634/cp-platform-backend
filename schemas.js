import mongoose from "mongoose";
import validator from "validator";
const userSchema = mongoose.Schema(
  {
    handle: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9_-]+$/,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "invalid email"],
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (password) {
          return password.length >= 8;
        },
        message: "password length must be at least 8 characters",
      },
    },
    role: {
      type: String,
      enum: ["user", "staff"],
      default: "user",
    },
    rating: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

const problemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    statement: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      validate: {
        validator: function (value) {
          return value % 100 === 0 && value >= 800 && value <= 3500;
        },
        message:
          "problem difficulty must be divisble by 100 and between [800,3500]",
      },
    },
  },
  { timestamps: true },
);

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
blogSchema.set("toJSON", { virtuals: true });
blogSchema.set("toObject", { virtuals: true });
const commentSchema = mongoose.Schema(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const refreshTokenSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      unique: true,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);
blogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "targetId",
  justOne: false,
});
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const User = mongoose.model("User", userSchema);
export const Blog = mongoose.model("Blog", blogSchema);
export const Problem = mongoose.model("Problem", problemSchema);
export const Comment = mongoose.model("Comment", commentSchema);
export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
