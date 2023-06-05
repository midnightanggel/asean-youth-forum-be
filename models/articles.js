import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, "Please add tittle"],
    },
    content:{
        type: String,
        trim: true,
        required: [true, "please add content"],
    },
    image:{
        type: String,
        required: [true, "please add images"]
    },
    date:{
        type: Date,
        default: Date.now,
        required: [true],
    },
    like:{
        type: Array,
        default: [],
    },
    dislike:{
        type: Array,
        default: [],
    },
    comment:{
        type: Array,
        default: [],
    },
});

export default mongoose.model("articles", articleSchema);
