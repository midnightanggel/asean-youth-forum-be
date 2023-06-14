const article = require("../models/articles.js");
const Users = require("../models/users.js");

const cloudinary = require("../config/cloudinary.js");
// handle createarticle
module.exports = {
  createarticles: async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title) {
        return res.status(400).json({
          status: "failed",
          message: "Please add a Tittle",
        });
      }
      if (!content) {
        return res.status(400).json({
          status: "failed",
          message: "Please add a Content",
        });
      }
      const _base64 = Buffer.from(req.files.image.data, "base64").toString(
        "base64"
      );
      const base64 = `data:image/jpeg;base64,${_base64}`;
      const cloudinaryResponse = await cloudinary.uploader.upload(base64, {
        public_id: new Date().getTime(),
      });
      let articles = await article.create({
        title: req.body.title,
        content: req.body.content,
        image: cloudinaryResponse.secure_url,
      });
      res.status(200).json({
        status: "success",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },

  //get all articles
  getAllArticles: async (req, res) => {
    try {
      const { search } = req.query;
      let query = {};
      if (search) {
        query.title = { $regex: search, $options: `i` };
      }
      const articles = await article
        .find(query)
        .populate("comments.user", "name")
        .exec();
      if (!articles) {
        return res.status(404).json({ message: "Not found " });
      }
      res.status(200).json({
        status: "success",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },

  //get article by id
  getArticle: async (req, res) => {
    try {
      const articles = await article
        .findById(req.params.id)
        .populate("comments.user", "name")
        .exec();

      if (!articles) {
        return res.status(404).json({ status: "Not found " });
      }
      res.status(200).json({
        status: "success",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },

  //update article
  updateArticle: async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title) {
        return res.status(400).json({
          status: "failed",
          status: "Please add a Tittle",
        });
      }
      if (!content) {
        return res.status(400).json({
          status: "failed",
          status: "Please add a Content",
        });
      }
      const _base64 = Buffer.from(req.files.image.data, "base64").toString(
        "base64"
      );
      const base64 = `data:image/jpeg;base64,${_base64}`;

      const cloudinaryResponse = await cloudinary.uploader.upload(base64, {
        public_id: new Date().getTime(),
      });
      let articles = await article.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          content: req.body.content,
          image: cloudinaryResponse.secure_url,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!articles) {
        return res.status(404).json({ status: "Article Not found" });
      }
      res.status(200).json({
        status: "success",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },
  //delete article
  deleteArticle: async (req, res) => {
    try {
      const articles = await article.findByIdAndRemove(req.params.id);
      if (!articles) {
        return res.status(404).json({ status: "Not found " });
      }
      res.status(200).json({
        status: "success",
        message: "Article has been deleted",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },

  //add comment on article
  createComment: async (req, res) => {
    try {
      const articles = await article.findById(req.params.id);
      if (!articles) {
        return res
          .status(404)
          .json({ status: "failed", message: "Article not found" });
      }
      const user = await Users.findById(req.user.id);
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found" });
      }

      articles.comments.push({
        user: user._id,
        comment: req.body.comment,
        createdAt: Date.now(),
      });
      await articles.save();
      res
        .status(200)
        .json({ status: "success", message: "Comment added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
        message: "Failed add comment",
      });
    }
  },

  getMostCommented: async (req, res) => {
    try {
      const articles = await article
        .aggregate([
          {
            $project: {
              _id: 1,
              title: 1,
              image: 1,
              date: 1,
              commentCount: { $size: { $ifNull: ["$comments", []] } },
            },
          },
          {
            $sort: {
              commentCount: -1,
            },
          },
          {
            $limit: 5,
          },
        ])
        .exec();
      if (!articles) {
        return res.status(404).json({ message: "Not found " });
      }
      res.status(200).json({
        status: "success",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "failed",
      });
    }
  },
};
