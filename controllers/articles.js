import article from "../models/articles.js";


// handle createarticle
export const createarticles = async (req, res) => {
    try {
      let articles = await article.create(req.body);
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
  };

//get all articles
export const getAllArticles = async (req, res) => {
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
};

//get article by id
export const getArticle = async (req, res) => {
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
    res.status(500).send("Server Error");
  }
};

//update article
export const updateArticle = async (req, res) => {
  try {
    let articles = await article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!articles) {
      return res.status(404).json({ message: "Not found " });
    }

    res.status(200).json({
      message: "success",
      data: articles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

export const deleteArticle = async (req, res) => {
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
};