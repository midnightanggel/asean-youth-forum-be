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
            message: "Please add a Tittle",
          })
        }
        if(!content){
          return res.status(400).json({
            status: "failed",
            message: "Please add a Content" 
          })
        }
      const _base64 = Buffer.from(req.files.image.data, 'base64').toString('base64');
      const base64 = `data:image/jpeg;base64,${_base64}`;
      const cloudinaryResponse = await cloudinary.uploader.upload(base64, { public_id: new Date().getTime() });
      let articles = await article.create({
        title : req.body.title,
        content: req.body.content,
        image : cloudinaryResponse.secure_url
      })
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
  getAllArticles : async (req, res) => {
    try {
      const articles = await article.find();
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
  getArticle : async (req, res) => {
    try {
      const articles = await article.findById(req.params.id);

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
  updateArticle : async (req, res) => {
    try {
      const {title, content} = req.body;
        if(!title){
          return res.status(400).json({
            status: "failed",
            status: "Please add a Tittle",
          })
        }
        if(!content){
          return res.status(400).json({
            status: "failed",
            status: "Please add a Content" 
          })
        }
      const _base64 = Buffer.from(req.files.image.data, 'base64').toString('base64');
      const base64 = `data:image/jpeg;base64,${_base64}`;
  
      const cloudinaryResponse = await cloudinary.uploader.upload(base64, { public_id: new Date().getTime() });
      let articles = await article.findByIdAndUpdate(req.params.id, {
        title : req.body.title,
        content: req.body.content,
        image : cloudinaryResponse.secure_url
      }, {
        new: true,
        runValidators: true,
      });
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

  deleteArticle : async (req, res) => {
    try {
      const articles = await article.findByIdAndRemove(req.params.id);
      if (!articles) {
        return res.status(404).json({ status: "Not found " });
      }
      res.status(200).json({
        status: "Article has been deleted",
        data: articles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
      status: "failed",
      });
  }
  }
}