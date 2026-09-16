import bcrypt from "bcrypt";
import { User, RefreshToken } from "../schemas.js";
import JWT from "jsonwebtoken";
import crypto from "crypto";
const generateTokens = (id, role, rating) => {
  const accessToken = JWT.sign(
    { _id: id, role: role, rating: rating },
    process.env.SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );
  const refreshToken = JWT.sign({ _id: id }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
const cookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};
export const registerController = async (req, res) => {
  try {
    const { email, handle, password } = req.body;
    let existedUser = await User.findOne({ handle: handle });
    if (existedUser) {
      return res.status(400).send("handle already exists");
    }
    existedUser = await User.findOne({ email: email });
    if (existedUser) {
      return res.status(400).send("email already exists , make sure to log in");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      handle: handle,
      email: email,
      password: hashedPassword,
    });
    return res.status(201).send("registered successfully");
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const loginController = async (req, res) => {
  try {
    const { handle_or_email, password } = req.body;
    let user = {};
    if (handle_or_email.includes("@")) {
      user = await User.findOne({ email: handle_or_email });
    } else user = await User.findOne({ handle: handle_or_email });
    if (!user) {
      return res.status(400).send("wrong credentials");
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).send("wrong credentials");
    }
    const { accessToken, refreshToken } = generateTokens(
      user._id,
      user.role,
      user.rating,
    );
    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await RefreshToken.create({
      userId: user._id,
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie("accessToken", accessToken, {
      ...cookieOption,
      path: "/codeforces",
      maxAge: 1000 * 60 * 15,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOption,
      path: "/codeforces/auth",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).send("logged in successfully");
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const tokenController = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      return res.status(400).send("refresh token is missing");
    }
    let decoded = {};
    try {
      decoded = JWT.verify(oldRefreshToken, process.env.REFRESH_SECRET_KEY);
    } catch (error) {
      return res.status(401).send("invalid or expired refresh token");
    }
    const hashedToken = crypto
      .createHash("sha256")
      .update(oldRefreshToken)
      .digest("hex");
    const existedToken = await RefreshToken.findOne({
      userId: decoded._id,
      tokenHash: hashedToken,
    });
    if (!existedToken) {
      return res.status(400).send("invalid or expired token");
    }
    await RefreshToken.deleteOne({ _id: existedToken._id });
    const user = await User.findById(decoded._id);
    const { accessToken, refreshToken } = generateTokens(
      user._id,
      user.role,
      user.rating,
    );
    const newHashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const newToken = await RefreshToken.create({
      userId: decoded._id,
      tokenHash: newHashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie("accessToken", accessToken, {
      ...cookieOption,
      path: "/codeforces",
      maxAge: 1000 * 60 * 15,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOption,
      path: "/codeforces/auth",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).send("successfull");
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export const logoutController = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (incomingRefreshToken) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(incomingRefreshToken)
        .digest("hex");
      await RefreshToken.deleteOne({ tokenHash: tokenHash });
    }
    res.clearCookie("accessToken", { ...cookieOption, path: "/codeforces" });
    res.clearCookie("refreshToken", {
      ...cookieOption,
      path: "/codeforces/auth",
    });
    return res.status(200).send("Logged out successfully");
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
};
