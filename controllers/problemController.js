import { Problem } from "../schemas.js";
import mongoose from "mongoose";
export const getProblems = async (req, res) => {
  try {
    const { order, tags, minRating, maxRating } = req.query;
    let filter = {};
    if (tags) {
      const tagsArray = tags.split(",").map((e) => e.trim());
      filter.tags = { $in: tagsArray };
    }
    let min = {};
    let max = {};
    if (isNaN(minRating)) {
      min = 800;
    } else min = parseInt(minRating);
    if (isNaN(maxRating)) {
      max = 3500;
    } else max = parseInt(maxRating);
    filter.rating = { $gte: min, $lte: max };
    const sort = {};
    if (order === "BY_RATING_ASC") {
      sort.rating = 1;
    } else if (order === "BY_RATING_DCS") {
      sort.rating = -1;
    } else {
      sort.createdAt = 1;
    }
    const problems = await Problem.find(filter).sort(sort).limit(100);
    res.status(200).send(problems);
  } catch (error) {
    res.status(500).send("internal server error");
  }
};

export const getProblemById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("invalid id");
    }
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).send("problem not found");
    }
    return res.status(200).send(problem);
  } catch (error) {
    res.status(500).send("internal server error");
  }
};

export const postProblem = async (req, res, next) => {
  try {
    const { title, statement, tags } = req.body;
    const rating = parseInt(req.body.rating);
    if (!title || !statement || !tags || !rating) {
      return res
        .status(400)
        .send("title,statement,rating and tags cant be empty");
    }
    if (!Array.isArray(tags)) {
      return res.status(400).send("tags must be an array");
    }
    if (rating % 100 !== 0 || rating < 800 || rating > 3500) {
      return res.status(400).send("rating must be between 800 and 3500");
    }
    const tagsArray = tags.map((e) => e.trim());
    await Problem.create({
      title: title,
      statement: statement,
      tags: tagsArray,
      rating: rating,
    });
    return res.status(201).send("problem has been created successfully");
  } catch (error) {
    return res.status(500).send("internal server error");
  }
};
