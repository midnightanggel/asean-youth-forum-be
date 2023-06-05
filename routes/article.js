import express from "express";
import { createarticles } from "../controllers/articles.js";

const router = express.Router();

const article = router.post("/create", createarticles);

export default article;