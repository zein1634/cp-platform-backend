import { User } from "../schemas.js";
import jwt from "jsonwebtoken";
const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).send("access token is missing");
    }
    let decoded = {};
    try {
      decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(401).send("invalid or expired access token");
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};

export default authMiddleware;
