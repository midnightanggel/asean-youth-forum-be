const express= require("express");
const auth = require("../middleware/auth")

const { register, login, getUser, updateUser } = require("../controllers/users.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getUser)
router.put("/me/update", auth, updateUser)

module.exports = router;