const CatchAsync = require('../utils/CatchAsync');
const blogModel = require('../Models/blogModel');

exports.GetBlogs = CatchAsync(async(req,res,next)=>{
    const Blogs = await blogModel.find().sort('-CreatedOn');
    if(!Blogs){
        res.status(404).json({message:'no Blogs Available'});
    }
    res.status(200).json({message:'successfuly found blogs',Blogs});

})

exports.GetBlog = CatchAsync(async(req,res,next)=>{
    const blogId = req.body.body.blogid;
    console.log(blogId);
    if(!blogId){
        res.status(404).json({message:'no Blog Id received'});
    }
    const Blog = await blogModel.findOne({_id:blogId})
    if(!Blog){
        res.status(404).json({message:'Blog not found'});
    }
    res.status(200).json({message:'successfuly found blogs',Blog});
})

exports.CreateBlog = CatchAsync(async(req,res,next)=>{
    const Blog = req.body.blog;
    if(!Blog){
        res.status(404).json({message:'no Blog received'});
    }
    const createdBlog = await blogModel.create(Blog);
    if(!createdBlog){
        res.status(500).json({message:'error creating blog'});
    }
    res.status(200).json({message:'successfuly created blogs',Blog:createdBlog});
})

exports.UpdateBlog = CatchAsync(async(req,res,next)=>{
    const {Blog} = req.body.blog;
    const BlogId = req.body.blogid;
    if(!Blog||!BlogId){
        res.status(404).json({message:'no Blog Data received'});
    }
    const updatedBlog = await blogModel.findOneAndUpdate({_id:BlogId}, Blog);;
    if(!updatedBlog){
        res.status(500).json({message:'error updating blog'});
    }
    res.status(200).json({message:'successfuly updated blogs',Blog:updatedBlog});
})

exports.DeleteBlog = CatchAsync(async(req,res,next)=>{
    res.status(200).json({message:'successfuly deleted blogs'});
    
})