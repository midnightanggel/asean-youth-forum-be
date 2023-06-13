const mongoose = require("mongoose")

const forumSchema = new mongoose.Schema({
    tittle:{
        type: String,
        trim: true,
        required: [true, "Please add tittle"],
    },
    description:{
        type: String,
        trim: true,
        required: [true, "please add content"],
    },
    publish_date:{
        type: Date,
        default: Date.now,
        required: [true], 
    },
    image:{
        type: String,
        required: [true] 
    },
    author:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: false
    },
});

module.exports= mongoose.model("forum", forumSchema);