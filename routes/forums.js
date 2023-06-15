const express = require("express");
const {
  createforum,
  getAllForum,
  getForum,
  updateForum,
  deleteForum,
} = require("../controllers/forums.js");

const auth = require("../middleware/auth.js");

const router = express.Router();

router.post("/", auth, createforum);
router.get("/", getAllForum);
router.get("/:id", getForum);
router.put("/:id", auth, updateForum);
router.delete("/:id", auth, deleteForum);

module.exports = router;
