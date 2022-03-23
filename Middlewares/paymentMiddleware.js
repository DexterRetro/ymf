const CatchAsync = require("../utils/CatchAsync");
const userModel = require('../Models/userModel')

const PaymentProcess = CatchAsync(async(req,res,next)=>{

   const userId = req.body.id;
   const user = await userModel.findById(userId);
   if(!user){
       return res.status(403).json({message:'invalid Id'});
   }
   const membershipType = '';
   switch(user.role){
    case 'general-member':
        membershipType='';
        break;
    case 'corporate-membership': 
        membershipType='';
        break;
    case 'board-member': 
        membershipType='';
        break;
    case 'admin':
        membershipType='';
        break;
    default: 
        return res.status(403).json({message:'invalid Membership'});
   }
   req.membershipType = membershipType;
   req.User = user;
    next();
})

module.exports = PaymentProcess;