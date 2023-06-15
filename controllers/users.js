const Users = require("../models/users.js");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const cloudinary = require("../config/cloudinary.js")

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
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id)
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found " });
      }
      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      const {name, age, country} = req.body;
      if (!name) {
        return res.status(400).json({
          status: "failed",
          status: "Please add a Name",
        });
      }
      if (!age) {
        return res.status(400).json({
          status: "failed",
          status: "Please add a Age",
        });
      }
      if (!country) {
        return res.status(400).json({
          status: "failed",
          status: "Please add a Country",
        });
      }
      const _base64 = Buffer.from(req.files.image.data, "base64").toString(
        "base64"
      );
      const base64 = `data:image/jpeg;base64,${_base64}`;

      const cloudinaryResponse = await cloudinary.uploader.upload(base64, {
        public_id: new Date().getTime(),
      });
      let user = await Users.findByIdAndUpdate(
        req.user.id,
        {
          name: req.body.name,
          age: req.body.age,
          country: req.body.country,
          image: cloudinaryResponse.secure_url,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found " });
      }
      res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },
};
