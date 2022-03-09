const UserModel= require('../Models/userModel');
const jwt =require('jsonwebtoken');
const CatchAsync = require('../utils/CatchAsync');
const MobileAccount = require('../Models/mobileAccountModel');

exports.LogInMobile =CatchAsync(async(req,res,next)=>{
    const MobileNumber = req.body.Phone;
    if(!MobileNumber){
      return res.status(500).json({message:'No Mobile Number Received. Failed To LogIn'});
    }
    const mobileAc = await MobileAccount.findOne({mobileNumber:MobileNumber});
    if(!mobileAc){
      return res.status(404).json({message:'No WhatsApp Account found. Failed To LogIn'});
    }
    if(!mobileAc.AccountId){
      return res.status(400).json({message:'WhatsApp Account Not Linked to YMF Membership'});
    }
    const UserAccount = await UserModel.findOne({_id:mobileAc.AccountId});
    if(!UserAccount){
      return res.status(404).json({message:'No YMF Account found. Failed To LogIn'});
    }
    res.status(200).json({message:'successfuly found account info',User:UserAccount});
});



exports.logIn = CatchAsync(async(req,res,next)=>{

  const {ymfid,password} = req.body;
  let User = undefined;
  if(ymfid&&password){
    User = await UserModel.find({$or:[{'YMFID':ymfid},{'email':ymfid}]}).select('+password');
    if(User){

      if(User.length>0&&await User[0].correctPassword(password,User[0].password)){
        const token = await this.GetToken(User[0]._id,User[0].YMFID);
        User[0].password = undefined;
        res.status(200).json({message:'Log In Successful',User:User[0],token});
       
      }else{
        return res.status(404).json({message:'login details not correct. login Failed!'});
      }
  }else{
    return res.status(404).json({message:'entered login details not valid'});
  }}

});

exports.GetToken = async(id,ymfID)=>{
  const token = await jwt.sign({id,ymfID},process.env.TOKKEN_KEY,{expiresIn:'168h'});
  return token;
};

