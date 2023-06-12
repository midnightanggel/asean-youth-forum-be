const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dyrnjeddq',
  api_key: '461955111687546',
  api_secret: 'n6JBMxTCkUW-AXqqMHFB_DRa9f0'
});

module.exports = cloudinary;