const article = require("../models/articles.js");
const cloudinary = require("../config/cloudinary.js");
// handle createarticle
module.exports ={
  createarticles : async (req, res) => {
    try {
      const {title, content} = req.body;
        if(!title){
          return res.status(400).json({
            status: "failed",
            message: "Please add Tittle" 
          })
        }
        if(!content){
          return res.status(400).json({
            status: "failed",
            message: "Please add Content" 
          })
        }
      const upload = await cloudinary.uploader.upload(req.file.path);
      let articles = await article.create({
        title,
        content,
        image : upload.secure_url
      })
        res.status(200).json({
          message: "success",
          data: articles,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "failed",
      });
    }
  },

//get all articles
  getAllArticles : async (req, res) => {
    try {
      const articles = await article.find();
      res.status(200).json({
        message: "success",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("No data");
    }
  },

  //get article by id
  getArticle : async (req, res) => {
    try {
      const articles = await article.findById(req.params.id);

      if (!articles) {
        return res.status(404).json({ message: "Not found " });
      }
      res.status(200).json({
        message: "success",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("No data");
    }
  },

  //update article
  updateArticle : async (req, res) => {
    try {
      let articles = await article.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!articles) {
        return res.status(404).json({ message: "Article Not found " });
      }

      res.status(200).json({
        message: "success",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  },

  deleteArticle : async (req, res) => {
    try {
      const articles = await article.findByIdAndRemove(req.params.id);
      if (!articles) {
        return res.status(404).json({ message: "Not found " });
      }
      res.status(200).json({
        message: "Article has been deleted",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
}