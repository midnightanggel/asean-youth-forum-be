const express = require("express");
const {
  createarticles,
  getAllArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
} = require("../controllers/articles.js");

const auth = require("../middleware/auth.js");
const router = express.Router();

// route article
router.post("/", auth, createarticles);
router.get("/", getAllArticles);
router.get("/:id", getArticle);
router.post("/:id/comment", auth, createComment);
router.put("/:id", auth, updateArticle);
router.delete("/:id", auth, deleteArticle);

module.exports = router;
