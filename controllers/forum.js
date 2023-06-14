const forums = require("../models/forum.js");
const cloudinary = require("../config/cloudinary.js");

module.exports ={
    createforum : async (req, res) => {
      try {
        const {tittle, description,} = req.body;
          if(!tittle){
            return res.status(400).json({
              status: "failed",
              message: "Please add a tittle",
            })
          }
          if(!description){
            return res.status(400).json({
              status: "failed",
              message: "Please add a description" 
            })
          }
        const _base64 = Buffer.from(req.files.image.data, 'base64').toString('base64');
        const base64 = `data:image/jpeg;base64,${_base64}`;
        const cloudinaryResponse = await cloudinary.uploader.upload(base64, { public_id: new Date().getTime() });
        let forum = await forums.create({
          tittle : req.body.tittle,
          description: req.body.description,
          image : cloudinaryResponse.secure_url,
          author: req.user.id
        })
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

    getAllForum : async (req, res) => {
        try {
          const forum = await forums.find();
          if (!forum) {
            return res.status(404).json({ message: "Not found " });
          }
          res.status(200).json({
            message: "success",
            data: forum,
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({
          status: "failed",
          });
      }
    },
    
    getForum : async (req, res) => {
        try {
            const forum = await forums.findById(req.params.id);

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
            });
        }
    },

    updateForum : async (req, res) => {
        try {
            const {tittle, description,} = req.body;
            if(!tittle){
            return res.status(400).json({
                status: "failed",
                message: "Please add a tittle",
            })
            }
            if(!description){
            return res.status(400).json({
                status: "failed",
                message: "Please add a description" 
            })
            }
            const _base64 = Buffer.from(req.files.image.data, 'base64').toString('base64');
            const base64 = `data:image/jpeg;base64,${_base64}`;
        
            const cloudinaryResponse = await cloudinary.uploader.upload(base64, { public_id: new Date().getTime() });
            let forum = await forums.findByIdAndUpdate(req.params.id, {
            tittle : req.body.tittle,
            description: req.body.description,
            image : cloudinaryResponse.secure_url
            }, {
            new: true,
            runValidators: true,
            });
            if (!forum) {
            return res.status(404).json({ message: "Forum Not found" });
            }
            res.status(200).json({
            message: "success",
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
          return res.status(404).json({ status: "Not found " });
        }
        res.status(200).json({
          status: "success",
          message: "Article has been deleted",
          data: forum,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          status: "failed",
        });
      }
    },
}