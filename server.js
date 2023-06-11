import express from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import users from "./routes/users.js";
import articles from "./routes/articles.js";
import auth from "./middleware/auth.js";
// masukkan kedalam .env


config();
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/auth", users);
app.use("/api/articles",auth, articles);
app.get("/", (req, res) => res.send("Hello world"));
app.all("*", (req, res) =>
  res.send("Sorry, the route you are going to does not exist")
);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true, // semua ip diperbolehkan akses
        methods: ['GET', 'POST'],
    }
});

io.on('connection', function(socket) {
  console.info('user connected');

  socket.on('disconnect', () => {
      console.log('user disconnected');
  });    

  socket.on('sendMessage', function(msg) {
      io.emit('sendMessage', msg);
  });
})

app.listen(port, () => console.log(`Server running on port ${port}`));
