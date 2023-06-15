const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add tittle"],
  },
  content: {
    type: String,
    trim: true,
    required: [true, "please add content"],
  },
  image: {
    type: String,
    default: "https://aseanyouthforum.org/wp-content/uploads/2019/03/cropped-Logo-Asean-Youth-Forum-HR-01.png"
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true],
  },
  like: {
    type: Array,
    default: [],
  },
  dislike: {
    type: Array,
    default: [],
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
module.exports = mongoose.model("articles", articleSchema);
