const CatchAsync = require("../utils/CatchAsync");
const SaveImage = require("../utils/ImageSaver");


const VerifyIdPic = CatchAsync(async(req,res,next)=>{
    if(!req.body.idPhoto){
        return  res.status(400).json({message:'Image for Verification Not Sent'});
    }
    const ImageData = req.body.idPhoto.split(';base64,');
    const ImageProps =ImageData[0].split(':')[1];
    const ImageName = ImageSaver.GetImageSavename( `ID_${req.body.YMFID}`,ImageProps);
    const imageStatus = await SaveImage.SaveImage(ImageData[1],ImageName,'./pictures/IDPictures');
    if(imageStatus==='error'){
      return  res.status(500).json({message:'error in Saving blog Image'});
    }
    req.body.SavedPath = `./pictures/IDPictures/${ImageName}`;
    next();
})

module.exports = VerifyIdPic;