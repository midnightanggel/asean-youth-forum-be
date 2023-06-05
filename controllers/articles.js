import article from "../models/articles.js";

export const createarticles = async (req, res) => {
    try {

      const articles = await article.create(
          {
              title: req.body.title,
              content: req.body.content,
              image: req.body.image,
              date: req.body.date,
              like: req.body.like,
              dislike: req.body.dislike,
              comment: req.body.comment,
          }
          );
      res.status(200).json({
        message: "success",
        articles,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "failed",
      });
    }
  };