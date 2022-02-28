const UserModel = require('../Models/userModel');
const UnverifiedUser = require('../Models/UnverifiedUserModel');
const TransUser = require('../Models/TransitioningUserModel')
const auth = require('./LogInController');
const catchAsync = require('../utils/CatchAsync');
const mobileModel = require('../Models/mobileAccountModel');


exports.GetTransitioningUsers=catchAsync(async(req,res,next)=>{
  const Users=await TransUser.find();
  if(!Users){
    return res.status(404).json({message:'No Members In DataBase Found'});
  }
  res.status(200).json({message:'successfully found Users',Users});
});

exports.GetUnverifiedUsers=catchAsync(async(req,res,next)=>{
  const Users=await UnverifiedUser.find().sort('YMFID');
  if(!Users){
    return res.status(404).json({message:'No Members In DataBase Found'});
  }
  res.status(200).json({message:'successfully found Users',Users});
});

exports.CreateUserFromOldDB=catchAsync(async(req,res,next)=>{
  const userSplitNames = req.OldUser.NAME.split(' ');
  const userSurname = userSplitNames[0];
  userSplitNames.shift();
  const userName = userSplitNames.join(' ');
  let newUser = {
    userName:userName,
    userSurname:userSurname,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm,
    email:req.body.email,
    phoneNumber:req.OldUser.PHONE_NUMBER,
    IDNumber:req.OldUser.ID_NUMBER,
    Province:GetProperProvName(req.OldUser.CHAPTER),
    YMFID:req.OldUser.MEMBERSHIP_NUMBER,
    NationalIDPIC:req.IDpicName
    };
    const User = await TransUser.create(newUser);
    User.password = undefined;
    res.status(200).json({message:`Successfully Added ${User.userName}`});
})
exports.CreateUser = catchAsync(async(req,res,next)=>{
    let newUser = {
      userName:req.body.userName,
      userSurname:req.body.userSurname,
      password:req.body.password,
      passwordConfirm:req.body.passwordConfirm,
      email:req.body.email,
      phoneNumber:req.body.phoneNumber,
      IDNumber:req.body.IDNumber,
      Province:req.body.Province,
      };
    if(req.PaymentOption==='paynow'){
      newUser.RegistrationReceipt ={
        payementOption:'paynow',
        RefCode:req.PaymentResponse.Invoice,
        PollUrl:req.PaymentResponse.response.pollUrl}
    }else{
      newUser.RegistrationReceipt ={
        payementOption:req.body.OtherPayments.payment,
        RefCode:req.body.OtherPayments.refCode,
        PollUrl:undefined}
    }
    const User = await UnverifiedUser.create(newUser);
    User.password = undefined;
    if(req.PaymentOption==='paynow'){
      res.status(200).json({message:`Successfully Added ${User.userName}`,User,
      PaymentUrl:req.PaymentResponse.response.redirectUrl,
      Instructions:req.PaymentResponse.response.instructions,
      PaymentError:req.PaymentResponse.response.error});
    }else{
      res.status(200).json({message:`Successfully Added ${User.userName}`, PaymentUrl:'pendingAproval'});
    }
   
});

exports.SetUpUnverifiedWhatsAppAccount = catchAsync(async(req,res,next)=>{
  const user = await UserModel.findOne({YMFID:req.body.YMFID});
  if(user){
    await mobileModel.create({ mobileNumber:req.body.phoneNumber,AccountId:user._id});
    return res.status(200).json({message:'created account awaiting verification'});
  }
});

exports.GetAllUsers= catchAsync(async(req,res,next)=>{
  const Users=await UserModel.find().sort('YMFID');
  if(!Users){
    return res.status(404).json({message:'No Members In DataBase Found'});
  }
  res.status(200).json({message:'successfully found Users',Users});
})

exports.GetUser=catchAsync(async(req,res,next)=>{
  if(!req.user){
    return res.status(404).json({message:'token auth failed 101'});
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
  res.status(200).json({message:'successfully authenticated',user});
});
exports.UpdateUser = catchAsync(async(req,res,next)=>{
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

});

exports.DeleteUser =catchAsync(async (req,res,next)=>{
  if(isValidObjectId(req.body.user.id)){
    const user = await UserModel.findById(req.body.user.id);
    if (!user) {
      return res.status(500).json({message:'user validity failed'})
    }
    await UserModel.deleteOne({_id:req.body.user.id});
    return res.status(200).json({message:`deleted ${user.userName} successfuly`});
  }
  res.status(500).json({message:'error Not able to find user'});
});

exports.DeleteUnverifiedUser=catchAsync(async(req,res,next)=>{
  unverifiedUserId = req.params.id;
  if(!unverifiedUserId){
    return res.status(400).json({message:'Member ID not received'});
  }
  await UnverifiedUser.deleteOne({_id:unverifiedUserId});
  res.status(200).json({message:'deleted Unverified Member'});
})
exports.DeleteTransUser=catchAsync(async(req,res,next)=>{
  TransUserId = req.params.id;
  if(!TransUserId){
    return res.status(400).json({message:'Member ID not received'});
  }
  await TransUser.deleteOne({_id:TransUserId});
  res.status(200).json({message:'deleted Unverified Member'});
})

exports.RegisterNewUser=catchAsync(async(req,res,next)=>{
  unverifiedUserId = req.body.id;
  console.log(unverifiedUserId);
  if(!unverifiedUserId){
    return res.status(400).json({message:'Member ID not received'});
  }
  const user = await UnverifiedUser.findOne({_id:unverifiedUserId});
  if(!user){
    return res.status(404).json({message:'Member not found'});
  }
  const NewRegUser={
    userName:user.userName,
    userSurname:user.userSurname,
    YMFID:'',
    password:user.password,
    email:user.email,
    phoneNumber: user.phoneNumber,
    IDNumber: user.IDNumber,
    Province:user.Province,
    PaymentRecord:[]
    };
  NewRegUser.PaymentRecord.push({PaymentPurpose:'Registration',PaymentDate:Date.now(),PaymentRef:`${user.RegistrationReceipt.RefCode}_${user.RegistrationReceipt.payementOption}`});
  const count =await UserModel.find().count();
  let userNumber ='';
  if(count>100){
    userNumber = `${count+1}`
   
  }else if(count>9){
    userNumber=`0${count+1}`
    
  }else{
    userNumber =`00${count+1}`
  }
  NewRegUser.YMFID =`YMF${userNumber}${GetProvinceID(user.Province)}${new Date(Date.now()).getFullYear().toString().substring(2,4)}`;
  const newUser = await UserModel.create(NewRegUser);
  if(newUser){
    await UnverifiedUser.deleteOne({_id:user._id});
    return res.status(200).json({message:`successfully registered ${newUser.userName}`});
  }
  res.status(500).json({message:'failed to register User'});
})
exports.RegisterTransUser=catchAsync(async(req,res,next)=>{
  TransUserId = req.body.id;
  if(!TransUserId){
    return res.status(400).json({message:'Member ID not received'});
  }
  const user = await TransUser.findOne({_id:TransUserId});
  if(!user){
    return res.status(404).json({message:'Member not found'});
  }
  const NewRegUser={
    userName:user.userName,
    userSurname:user.userSurname,
    YMFID:user.YMFID,
    password:user.password,
    email:user.email,
    phoneNumber: user.phoneNumber,
    IDNumber: user.IDNumber,
    Province:user.Province,
    PaymentRecord:[]
    };
  const newUser = await UserModel.create(NewRegUser);
  if(newUser){
    await UnverifiedUser.deleteOne({_id:user._id});
    return res.status(200).json({message:`successfully registered ${newUser.userName}`});
  }
  res.status(500).json({message:'failed to register User'});
})

exports.RegisterUser=async (Invoice,result)=>{
  const user = await UnverifiedUser.findOne({'RegistrationReceipt.RefCode':Invoice});
  if(user){
    if(result.status==='paid'||result.status==='awaiting delivery'){
      const NewRegUser={userName:user.userName,
        userSurname:user.userSurname,
        YMFID:'',
        password:user.password,
        email:user.email,
        phoneNumber: user.phoneNumber,
        IDNumber: user.IDNumber,
        Province:user.Province,
        PaymentRecord:[]
        };
      NewRegUser.PaymentRecord.push({PaymentPurpose:'Registration',PaymentDate:Date.now(),PaymentRef:Invoice});
      const count =await UserModel.find().count();
      let userNumber ='';
      if(count>100){
        userNumber = `${count+1}`
       
      }else if(count>9){
        userNumber=`0${count+1}`
        
      }else{
        userNumber =`00${count+1}`
      }
      NewRegUser.YMFID =`YMF${userNumber}${GetProvinceID(user.Province)}${new Date(Date.now()).getFullYear().toString().substring(2,4)}`;
      const newUser = await UserModel.create(NewRegUser);
      const token = await auth.GetToken(UnverifiedUser._id,NewRegUser.YMFID);
      await UnverifiedUser.deleteOne({_id:user._id});
      return {token,newUser,result};
    }

    return {};
  }
  else{
    return {};
  }
}


function GetProvinceID(province){
  switch (province) {
      case 'Bulawayo Province':
          return "09";
      case 'Harare Province':
          return "05";
      case 'Manicaland Province':
          return "04";
      case 'Mashonaland Central Province':
          return "08";
      case 'Mashonaland East Province':
          return "10";
      case 'Mashonaland West Province':
          return "03";
      case 'Masvingo Province':
          return "07";
      case 'Matabeleland North Province':
          return "02";
      case 'Matabeleland South Province':
          return "06";
      case 'Midlands Province':
          return "01";
  }
}

function GetProperProvName(province){
  switch(province){
    case 'MIDLANDS':
      return 'Midlands Province';
    case 'BULAWAYO':
      return 'Bulawayo Province';
    case 'HARARE':
      return 'Harare Province';

    
  }
}
