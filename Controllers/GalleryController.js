const CatchAsync = require("../utils/CatchAsync");
const gallery = require('../Models/galleryModel')

exports.GetAllimages = CatchAsync(async(req,res,next)=>{
  const images =await gallery.find();
  res.status(200).json({message:'successfuly fetched images',images});
})