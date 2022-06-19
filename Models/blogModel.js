mongoose = require('mongoose');
const scheme = mongoose.Schema({
    Author:{type:String,require:true},
    CreatedOn:{type:Date,default:Date.now()},
    Topic:{type:String,require:true},
    Summary:{type:String,require:true},
    Content:[{paragraph:String,PImage:{ImbededImg:String,caption:String}}],
    Comments:[{commentor:String,Comment:String,commentedOn:{type:Date,default:Date.now()}}],
    Status:{type:String,enum:['verified','awaiting verification'],default:'awaiting verification',required:true},
    blogPicture:String
})
const blog = mongoose.model('blog',scheme,'blogs');
module.exports = blog;
