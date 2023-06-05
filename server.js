import express from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import users from "./routes/users.js";

// import auth from "./middleware/auth.js";
import article from "./routes/article.js";
// test

config();
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use("/users", users);
app.use(article);
app.get("/", (req, res) => res.send("Hello world"));
app.all("*", (req, res) =>
  res.send("Sorry, the route you are going to does not exist")
);

app.listen(port, () => console.log(`Server running on port ${port}`));
