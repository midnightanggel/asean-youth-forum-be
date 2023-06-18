const express = require("express");
const {
  createforum,
  getAllForum,
  getForum,
  updateForum,
  deleteForum,
  getMostChats,
} = require("../controllers/forums.js");

const auth = require("../middleware/auth.js");
const verifyRole = require("../middleware/verifyRole.js");

const router = express.Router();

router.post("/", auth, createforum);
router.get("/", getAllForum);
router.get("/most-chats", getMostChats);
router.get("/:id", getForum);
router.put("/:id", auth, verifyRole, updateForum);
router.delete("/:id", auth, verifyRole, deleteForum);

module.exports = router;
