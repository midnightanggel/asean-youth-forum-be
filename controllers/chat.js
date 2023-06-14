const chats = require("../models/chat");

module.exports ={
    addChat : async (req, res) => {
      try {
        const {forum_id, message} = req.body;
          if(!forum_id){
            return res.status(400).json({
              status: "failed",
              message: "Please add a forum_id",
            })
          }
          if(!message){
            return res.status(400).json({
              status: "failed",
              message: "Please add a message" 
            })
          }
          io.on('connection', function(socket) {
            console.info('user connected');
          
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });    
          
            socket.on('sendToForum', function(msg) {
              const parsed = JSON.parse(msg);
      
              const newDiscussion = {
                  forum_id: parsed.forum_id,
                  user_id: parsed.user_id,
                  message: parsed.message,
                  sent_at: new Date(),
              };
              
          });
          })
        let chat = await chats.create({
          forum_id : req.body.forum_id,
          user_id: req.user.id,
          message: req.body.message,
        })
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