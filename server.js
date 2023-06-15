const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const users = require("./routes/users.js");
const articles = require("./routes/articles.js");
const forums = require("./routes/forums.js");
const upload = require("express-fileupload");
const http = require("http");
const { Server } = require("socket.io");
const { createMessage } = require("./controllers/forums.js");

config();
const port = process.env.PORT;
const app = express();
app.use(upload());
app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/auth", users);
app.use("/api/articles", articles);
app.use("/api/forums", forums);
app.get("/", (req, res) => res.send("Hello world"));
app.all("*", (req, res) =>
  res.send("Sorry, the route you are going to does not exist")
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true, // semua ip diperbolehkan akses
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  console.info("user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("sendToForum", function (msg) {
    const parsed = JSON.parse(msg);

    const newDiscussion = {
      forum_id: parsed.forum_id,
      user_id: parsed.user_id,
      message: parsed.message,
      sent_at: new Date(),
    };

    // Save("ForumDiscussion", newDiscussion);

    io.emit("broadcastToFrontend", JSON.stringify(newDiscussion));
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

// import http from 'http';
// import { Server } from 'socket.io';

// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: process.env.SOCKET_ORIGIN,
//         methods: ['GET', 'POST'],
//     }
// });

// io.on('connection', function(socket) {
//   console.info('user connected');

//   socket.on('disconnect', () => {
//       console.log('user disconnected');
//   });

//   socket.on('sendMessage', function(msg) {
//       io.emit('sendMessage', msg);
//   });
// })
