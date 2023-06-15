const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add tittle"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "please add content"],
  },
  publish_date: {
    type: Date,
    default: Date.now,
    required: [true],
  },
  image: {
    type: String,
    default: "https://www.aseanbriefing.com/news/wp-content/uploads/2020/09/The-27th-ASEAN-Regional-Forum-Salient-Features.jpg"
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  chats: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: {
        type: String,
      },
      sendAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("forum", forumSchema);
