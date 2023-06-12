const express = require('express')
const{ 
    createarticles,
    getAllArticles,
    getArticle,
    updateArticle,
    deleteArticle
 }= require ("../controllers/articles.js");


const router = express.Router();

// route article
router.post("/", createarticles);
router.get("/", getAllArticles);
router.get("/:id", getArticle);
router.put("/:id", updateArticle)
router.delete("/:id", deleteArticle)

module.exports = router;