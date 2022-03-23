mongoose = require('mongoose');

const scheme = new mongoose.Schema({
  PictureName:{type:String},
  PictureUrl:{type:String,required:true},
  PictureCaption:{type:String}
})

const gallerymodel = mongoose.model('gallery',scheme,'Gallery');
module.exports = gallerymodel;