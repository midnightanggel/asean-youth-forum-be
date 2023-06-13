const express = require('express')
const{ 
    addChat,
    getChat
 }= require ("../controllers/chat.js");
const auth= require ("../middleware/auth.js");
const router = express.Router();

router.post("/",auth, addChat);
router.get("/:id", getChat)

module.exports = router