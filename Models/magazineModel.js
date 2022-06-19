mongoose = require('mongoose');

const scheme = new mongoose.Schema({
  URL:{type:String,required:true},
  UploadDate:{type:Date,default:Date.now()},
  MagName:{type:String,required:true,unique:true},
})

const magModel = mongoose.model('mag',scheme,'Magazines');
module.exports = magModel;
