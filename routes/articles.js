const express = require("express");
const {
  createarticles,
  getAllArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  createComment,
  getMostCommented,
} = require("../controllers/articles.js");

const auth = require("../middleware/auth.js");
const verifyRole = require("../middleware/verifyRole.js");
const router = express.Router();

// route article
router.post("/", auth, verifyRole, createarticles);
router.get("/most-commented", getMostCommented);
router.get("/", getAllArticles);
router.get("/:id", getArticle);
router.post("/:id/comment", auth, createComment);
router.put("/:id", auth, verifyRole, updateArticle);
router.delete("/:id", auth, verifyRole, deleteArticle);

module.exports = router;
