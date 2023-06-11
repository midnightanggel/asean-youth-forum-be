import express from "express";
import { 
    createarticles,
    getAllArticles,
    getArticle,
    updateArticle,
    deleteArticle
 } from "../controllers/articles.js";

const router = express.Router();

// route article
router.post("/", createarticles);
router.get("/", getAllArticles);
router.get("/:id", getArticle);
router.put("/:id", updateArticle)
router.delete("/:id", deleteArticle)

export default router;