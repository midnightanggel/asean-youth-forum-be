import express from "express";
import { createarticles } from "../controllers/articles.js";

const router = express.Router();

// route article
const article = router.post("/article", createarticles);

export default article;