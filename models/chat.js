const mongoose = require("mongoose")

const forumDetailsSchema = new mongoose.Schema({
    forum_id:{
        type: mongoose.Schema.ObjectId,
        ref : "forum",
        required: true
    },
    user_id:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    message:{
        type: String,
        required: [true] 
    },
    sent_at:{
        type: Date,
        default: Date.now,
        required: [true],
    },
});

module.exports= mongoose.model("forum_details", forumDetailsSchema);