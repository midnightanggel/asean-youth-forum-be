const Users = require("../models/users.js");

const verifyRole = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await Users.findById(userId).exec();

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found " });
    }

    if (user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        status: "failed",
        message: "You do not have admin permission",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
};

module.exports = verifyRole;
