const CatchAsync = require('../utils/CatchAsync');
const blogModel = require('../Models/blogModel');
const ImageSaver = require('../utils/ImageSaver');
const DocuReader = require('../utils/WordDocuExtrator')
const path = require('path');
const mime = require('mime')
const magModel = require('../Models/magazineModel')
const CloudFile = require('./FileCloudController')
const fsPromises = require('fs/promises')
const fs = require('fs')


exports.GetBlogs = CatchAsync(async(req,res,next)=>{
    const Blogs = await blogModel.find().sort('-CreatedOn');
    if(!Blogs){
        res.status(404).json({message:'no Blogs Available'});
    }
    res.status(200).json({message:'successfully found articles',Blogs});

})
exports.GetBlog = CatchAsync(async(req,res,next)=>{
    const blogId = req.body.body.blogid;
    if(!blogId){
        res.status(404).json({message:'no Blog Id received'});
    }
    const Blog = await blogModel.findOne({_id:blogId})
    if(!Blog){
        res.status(404).json({message:'Blog not found'});
    }
    res.status(200).json({message:'successfuly found blogs',Blog});
})
exports.VerifyBlog = CatchAsync(async(req,res,next)=>{
  const id = req.body.id;
  console.log(id)
  const Blog = await blogModel.findById(id);
  if(!Blog){
    res.status(404).json({message:'no Blog received'});
  }
  Blog.Status ='verified';
  await Blog.save();
    res.status(200).json({message:'successfuly verified blog'});
});
exports.UploadDocument = CatchAsync(async(req,res,next)=>{
  let file = req['files'].upload;
  console.log(file)
  if(!file){
    return res.status(400).json({message:'no document Received'});
  }
  const readDocu = await DocuReader.ReadDocument(file.data);
  const article = await readDocu.getBody().split('\n');
  let content=[];
  for (let index = 3; index < article.length; index++) {
    if(article[index]!==''){
      content.push({paragraph:article[index]});
    }
  }
  const Blog = {
    Author:article[0],
    Topic:article[1],
    Summary:article[2],
    Content:content,
  }

  res.status(200).json({message:'read document successfully',Blog:Blog});
})
exports.CreateBlog = CatchAsync(async(req,res,next)=>{
    const blog = req.body;
    if(!blog){
      return  res.status(400).json({message:'no blog Info Received'});
    }
    const paragraphs =[];
    blog.Content.forEach(element => {
      paragraphs.push({paragraph:element.paragraph,PImage:{ImbededImg:'',caption:element.caption}});
    });
    const CreatedBlog = await blogModel.create({
    Author:blog.Author,
    Topic:blog.Topic,
    Summary:blog.Summary,
    Content:paragraphs,
    blogPicture:''
    });
    if(!CreatedBlog){
      return  res.status(500).json({message:'failed To create Blog'});
    }
    const CoverImageInfo = blog.blogPicture.split(';base64,');
    const CoverImageUrl =CoverImageInfo[1];
    const CoverImageName =await ImageSaver.GetImageSavename(`Cover_${CreatedBlog._id}`,CoverImageInfo[0].split(':')[1]);
    const uploadCoverRes = await ImageSaver.SaveImage(CoverImageUrl,CoverImageName,mime.lookup(path.extname(CoverImageName)).split('/')[0]);
    CreatedBlog.blogPicture=uploadCoverRes;
    blog.Content.forEach(async(element,i) => {
      if(element.PImage){
        if(element.PImage.ImbededImg){
          const ImageUrl =  element.PImage.ImbededImg.split(';base64,')[1];
          const ImageName = await ImageSaver.GetImageSavename(`blogPic_${CreatedBlog._id}_${i}`,element.PImage.ImbededImg.split(';base64,')[0]);
          const uploadImagesRes = await ImageSaver.SaveImage(ImageUrl,ImageName,mime.lookup(path.extname(ImageName)).split('/')[0])
          CreatedBlog.Content[i].PImage.ImbededImg = uploadImagesRes;
        }
      }
    });
     const UpdatedBlog = await CreatedBlog.save();
    if(!UpdatedBlog){
      await blogModel.findOneAndDelete({_id:CreatedBlog._id});
      return  res.status(500).json({message:'failed To create Blog'});
    }
    res.status(200).json({message:'successfuly Uploaded Article',Blog:UpdatedBlog});
})

exports.UpdateBlog = CatchAsync(async(req,res,next)=>{
    const BlogId = req.body.id;
    if(!BlogId){
       res.status(404).json({message:'no Blog Id received'});
    }
    let Blog = await blogModel.findById(BlogId);
    if(!Blog){
        res.status(500).json({message:'error blog Not Found'});
    }
    if(req.body.comment){
      Blog.Comments.push({commentor:req.body.comment.name,Comment:req.body.comment.comment});
    }else{
      if(req.body.blog.Author){
        Blog.Author=req.body.blog.Author;
      }
      if(req.body.blog.Topic){
        Blog.Topic = req.body.blog.Topic;
      }
      if(req.body.blog.Summary){

        Blog.Summary = req.body.blog.Summary;
      }
      if(req.body.blog.Content){
        Blog.Content = req.body.blog.Content;
      }
    }

   await Blog.save().then(up=>{
    const updatedBlog = up;
    res.status(200).json({message:'successfuly updated blogs',Blog:updatedBlog});
    });

})

exports.DeleteBlog = CatchAsync(async(req,res,next)=>{
  const id = req.body.id;
  if(!id){
    return res.status(400).json({message:'id not valid'});
  }
    await blogModel.findByIdAndRemove(id);
    res.status(200).json({message:'successfuly deleted blogs'});

})


exports.UploadMagazine = CatchAsync(async(req,res,next)=>{
  let file = req['files'].upload;
  if(!file){
    return res.status(400).json({message:'no document Received'});
  }

  const response = await CloudFile.UploadFile(file.data,'PDF',file.name);
  await magModel.create({URL:response,MagName:path.basename(file.name)});
  res.status(200).json({message:'success'});

})

exports.GetMagazineList = CatchAsync(async(req,res,next)=>{
  const magazines = await magModel.find();
  if(!magazines){
    return res.status(404).json({message:'Magazine List not found'});
  }
  res.status(200).json({message:'success:Fetched Magazines',magazines:magazines});

})

exports.DeleteMagazine = CatchAsync(async(req,res,next)=>{
  console.log(req.params)
  const id = req.params.id;
  if(!id){
    return res.status(400).json({message:'no id received'});
  }
  const mag = await magModel.findOne({_id:id});
  if(!mag){
    return res.status(404).json({message:'Magazine Record not found'});
  }
 // await CloudFile.DeleteFile(mag.URL);
  await magModel.findOneAndDelete({_id:id})
  res.status(200).json({message:'success:Removed Magazine'})

})
