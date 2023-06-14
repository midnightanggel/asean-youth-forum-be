const Users = require("../models/users.js");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
  register: async (req, res) => {
    try {
      const { name, age, country, email, password, confirmPassword } = req.body;
      if (!name) {
        return res.status(400).json({
          status: "failed",
          message: "please insert name",
        });
      }
      if (!age) {
        return res.status(400).json({
          status: "failed",
          message: "please insert age",
        });
      }
      if (!country) {
        return res.status(400).json({
          status: "failed",
          message: "please insert country",
        });
      }
      if (!email) {
        return res.status(400).json({
          status: "failed",
          message: "please insert email",
        });
      }
      const isMatch = await Users.findOne({ email: email }).exec();
      if (isMatch) {
        return res.status(400).json({
          status: "failed",
          message: "email already exist, please login",
        });
      }
      if (!password || !confirmPassword) {
        return res.status(400).json({
          status: "failed",
          message: "please insert password or confirmation password",
        });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({
          status: "failed",
          message: "password not match",
        });
      }
      const user = await Users.create({
        name: req.body.name,
        age: req.body.age,
        country: req.body.country,
        email: req.body.email,
        password: req.body.password,
      });
      res.status(200).json({
        status: "success",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          status: "failed",
          message: "Please provide an email and password",
        });
      }

      const user = await Users.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({
          status: "failed",
          message: "Wrong email or password",
        });
      }
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({
          status: "failed",
          message: "Wrong email or password",
        });
      }

      const token = jwt.sign({ id: user._id }, jwtSecret);

      res.status(200).json({
        status: "success",
        token,
        user: {
          id: user.id,
          name: user.name,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },
};
