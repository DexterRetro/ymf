const UserModel = require('../Models/userModel');
const auth = require('./LogInController');
const pay = require('./payController');
const catchAsync = require('../utils/CatchAsync');


exports.CreateUser = catchAsync(async(req,res,next)=>{
    const User = await UserModel.create({
        userName:req.body.userName,
        userSurname:req.body.userSurname,
        role:req.body.role,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        email:req.body.email.toString(),
        phoneNumber:req.body.phoneNumber,
        IDNumber:req.body.IDNumber,
        Province:req.body.Province,
        RegistrationPollURL:req.PaymentResponse.pollUrl,
        });
    User.password = undefined;

    res.status(200).json({message:`Successfully Registered ${User.userName}`,User,PaymentUrl:req.PaymentResponse.redirectUrl});
});
exports.GetUser=async(req,res,next)=>{
  if(!req.user){
    res.status(404).json({message:'token auth failed 101'});
  }
  console.log(req.user);
  const id = req.user.id.toString();
  const ymfID = req.user.ymfID;
  if(!id||!ymfID){
    res.status(404).json({message:'token auth failed 102'});
  }
  const user = await UserModel.findById({_id:id});
  if(!user){
    res.status(404).json({message:'user not found'});
  }
  if(!user.YMFID===ymfID){
   res.status(404).json({message:'user ID does not match'});
  }
  res.status(200).json({message:'successfuly authenticated',user});


}
exports.UpdateUser = async(req,res,next)=>{
    const user = await UserModel.findById(req.body.id);
    if (!user) {
      return res.status(500).json({message:'user validity failed'})
    }
    if (req.body.userName) {
      user.userName = req.body.userName;
    }
    if (req.body.userSurname) {
      user.userSurname = req.body.userSurname;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.phoneNumber) {
      user.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.idNumber) {
      user.IDNumber = req.body.IDNumber;
    }
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: `updated ${user.userName}'s Profile Sucessfuly`,
      user,
    });

}

exports.DeleteUser = async (req,res,next)=>{
  if(isValidObjectId(req.body.user.id)){
    const user = await UserModel.findById(req.body.user.id);
    if (!user) {
      return res.status(500).json({message:'user validity failed'})
    }
    await UserModel.deleteOne({_id:req.body.user.id});
    return res.status(200).json({message:`deleted ${user.userName} successfuly`});
  }
  res.status(500).json({message:'error Not able to find user'});
}

exports.RegisterUser= async(PhoneNumber,Invoice)=>{
  const user = await UserModel.findOne({PhoneNumber});
  if(user){

    const res = await pay.PollResults(user.RegistrationPollURL);
    if(res.status==='paid'||res.status==='awaiting delivery'){
      user.Registered = true;
      user.RegistrationPollURL = undefined;
      user.PaymentRecord.push({PaymentPurpose:'',PaymentDate:Date.now(),PaymentRef:Invoice});
      await user.save({ validateBeforeSave: false });
      const token = await auth.GetToken(user._id,user.YMFID);
      return {token,user,res};
    }

    return {token:undefined,user:undefined,res:undefined};
  }
  else{
    return {token:undefined,user:undefined,res:undefined};
  }
}
