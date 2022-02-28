mongoose = require('mongoose');
const scheme = mongoose.Schema({
    Author:{type:String,require:true},
    CreatedOn:{type:Date,default:Date.now()},
    Topic:{type:String,require:true},
    Summary:{type:String,require:true},
    Content:[{paragraph:String,PImage:{ImbededImg:String,caption:String}}],
    blogPicture:String
})
const article = mongoose.model('article',scheme,'unAprrovedBlogs');
module.exports = article;