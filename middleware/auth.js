const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

const jwtSecret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ status: "failed", message: "No token, authorization denied" });
  }
  try {
    jwt.verify(token, jwtSecret, (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ status: "failed", message: "Token is not valid" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

module.exports = auth;
