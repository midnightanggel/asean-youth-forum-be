const chats = require("../models/chat");
// const io = require("../config/socket")
module.exports ={
    getChat : async (req, res) => {
      try {
        const chat = await chats.find({forum_id: req.params.id});
        if (!chat) {
          return res.status(404).json({ message: "Not found " });
        }
        io.emit('broadcastToFrontend', chat);
        res.status(200).json({
          status: "success",
          data: chat,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
        status: "failed",
        });
    }
  },
}