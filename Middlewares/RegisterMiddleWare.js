const CatchAsync = require("../utils/CatchAsync");
const oldDB = require('../Models/olduserModel')
const ImageSaver = require('../utils/ImageSaver')

const Register= CatchAsync(async(req,res,next)=>{
    
   const userID = req.body.YMFID;
   if(!userID){
       return res.status(400).json({message:'In Valid YMF ID'});
   }
   const User = await oldDB.findOne({MEMBERSHIP_NUMBER:userID});
   if(!User){
       return res.status(404).json({message:'Member does not Exist'});
   }
   req.OldUser= User;
   if(!req.body.IDpic){
    return res.status(400).json({message:'In Valid ID Pic'});
   }
   const ImageData = req.body.IDpic.split(';base64,');
    const ImageProps =ImageData[0].split(':')[1];
    const ImageName = ImageSaver.GetImageSavename( `IDPIC_${Date.now()}_${userID}`,ImageProps);
    const imageStatus = await ImageSaver.SaveImage(ImageData[1],ImageName,'./pictures/IDpics');
    req.IDpicName = ImageName;
   next();
})

module.exports=Register;