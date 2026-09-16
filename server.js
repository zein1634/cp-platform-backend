import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./router.js";
import dotenv from "dotenv";
import { User } from "./schemas.js";
dotenv.config();

const app = express();
const URI = process.env.MONGO_URI;
const port = process.env.PORT;
mongoose
  .connect(URI)
  .then(() => {
    console.log("connected to DB successfully");
  })
  .catch((e) => {
    console.log(e.message);
  });

app.use(express.json());
app.use(cookieParser());

app.use("/codeforces", router);

app.listen(port, () => {
  console.log(`life is shitty especially if ur running on port ${port}`);
});
