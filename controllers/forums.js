const forums = require("../models/forums.js");
const Users = require("../models/users.js");
const cloudinary = require("../config/cloudinary.js");

module.exports = {
  createforum: async (req, res) => {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({
          status: "failed",
          message: "Please add a title",
        });
      }
      if (!description) {
        return res.status(400).json({
          status: "failed",
          message: "Please add a description",
        });
      }
      const _base64 = Buffer.from(req.files.image.data, "base64").toString(
        "base64"
      );
      const base64 = `data:image/jpeg;base64,${_base64}`;
      const cloudinaryResponse = await cloudinary.uploader.upload(base64, {
        public_id: new Date().getTime(),
      });
      let forum = await forums.create({
        title: req.body.title,
        description: req.body.description,
        image: cloudinaryResponse.secure_url,
        author: req.user.id,
      });
      res.status(200).json({
        status: "success",
        data: forum,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },
  deleteForum: async (req, res) => {
    try {
      const forum = await forums.findByIdAndRemove(req.params.id);
      if (!forum) {
        return res
          .status(404)
          .json({ status: "failed", message: "Forum not found" });
      }
      res.status(200).json({
        status: "success",
        message: "Forum has been deleted",
        data: forum,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },
  getAllForum: async (req, res) => {
    try {
      const { search } = req.query;
      let query = {};
      if (search) {
        query.title = { $regex: search, $options: `i` };
      }
      const forum = await forums
        .find(query)
        .sort({ publish_date: -1 })
        .populate("author", "name")
        .populate("chats.user", "name image")
        .exec();
      if (!forum) {
        return res
          .status(404)
          .json({ status: "failed", message: "Not found " });
      }
      res.status(200).json({
        status: "success",
        data: forum,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },

  getForum: async (req, res) => {
    try {
      const forum = await forums
        .findById(req.params.id)
        .populate("author", "name")
        .populate("chats.user", "name image")
        .exec();

      if (!forum) {
        return res
          .status(404)
          .json({ status: "failed", message: "Not found " });
      }
      res.status(200).json({
        status: "success",
        data: forum,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },

  updateForum: async (req, res) => {
    try {
      const { title, description } = req.body;
      if (!title && !description && !req.files) {
        return res.status(400).json({
          status: "failed",
          message: "Please update at least one data",
        });
      }

      const dataForum = {
        title,
        description,
      };

      if (req.files) {
        const _base64 = Buffer.from(req.files.image.data, "base64").toString(
          "base64"
        );
        const base64 = `data:image/jpeg;base64,${_base64}`;

        const cloudinaryResponse = await cloudinary.uploader.upload(base64, {
          public_id: new Date().getTime(),
        });

        dataForum.image = cloudinaryResponse.secure_url;
      }
      const forum = await forums.findByIdAndUpdate(req.params.id, dataForum, {
        new: true,
        runValidators: true,
      });
      if (!forum) {
        return res
          .status(404)
          .json({ status: "failed", message: "Forum Not found" });
      }
      res.status(200).json({
        status: "failed",
        message: "Forum updated",
        data: forum,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },
  getMostChats: async (req, res) => {
    try {
      const forum = await forums.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorInfo",
          },
        },
        {
          $addFields: {
            author: { $arrayElemAt: ["$authorInfo.name", 0] },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            author: 1,
            publish_date: 1,
            image: 1,
            chatCount: { $size: { $ifNull: ["$chats", []] } },
          },
        },
        {
          $sort: {
            chatCount: -1,
          },
        },
        {
          $limit: 5,
        },
      ]);
      if (!forum) {
        return res.status(404).json({ message: "Not found " });
      }
      res.status(200).json({
        status: "success",
        data: forum,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "failed get data",
      });
    }
  },
  createMessage: async (forumId, userId, message) => {
    try {
      const forum = await forums.findById(forumId);
      if (!forum) {
        return { status: "failed", message: "Forum not found" };
      }
      const user = await Users.findById(userId);
      if (!user) {
        return { status: "failed", message: "User not found" };
      }
      if (!message) {
        return { status: "failed", message: "Please add a message" };
      }
      forum.chats.push({
        user: user._id,
        message: message,
        sendAt: Date.now(),
      });
      await forum.save();
      return { status: "success", message: "Message added successfully" };
    } catch (error) {
      console.log(error);
      return { status: "failed", message: "Failed to add message" };
    }
  },
};
