const UserModel= require('../Models/userModel');
const jwt =require('jsonwebtoken')

exports.logIn = async(req,res,next)=>{

  const {YMFID,email,phoneNumber,password} = req.body;
  let User;
  if(YMFID&&password||email&&password||phoneNumber&&password){
    if(phoneNumber){
        User = await UserModel.findOne({phoneNumber}).select('+password');
      }
    if(email){
        User = await UserModel.findOne({email}).select('+password');
      }
    if(YMFID){
        User = await UserModel.findOne({YMFID}).select('+password');
      }
    if(User){
        if(User.Registered){
          if(await User.correctPassword(password,User.password)){
            const token = await this.GetToken(User._id,User.YMFID);
            User.password = undefined;
            res.status(200).json({message:'Log In Successfull',User,token});
           }else{
            return res.status(404).json({message:'login details not correct.LogIn Failed!'});
          }
        }else{
          return res.status(404).json({message:'Not registred Please Pay Required Reg Fees First!'});
        }


      }else{

        return res.status(404).json({message:'login details not correct.LogIn Failed!'});
      }

  }else{
    return res.status(404).json({message:'entered login details not valid'});
  }


}

exports.GetToken = async(id,ymfID)=>{
  const token = await jwt.sign({id,ymfID},process.env.TOKKEN_KEY,{expiresIn:'168h'});
  return token;
}

