const pay = require('../Controllers/payController')
const itemModel = require('../Models/ItemModel');
const CatchAsync = require('../utils/CatchAsync');

//creates payment and forwards to account creation
const SignUp = CatchAsync(async(req,res,next)=>{
  if(req.body.PayNowcart){
    let cartType=['Registration'];
    const price = await itemModel.find({ItemName:cartType});
    const response = await pay.Pay(price,`${req.body.userName} ${req.body.userSurname}`,req.body.phoneNumber,'New Member Registration');
    if(response.response.success){
      req.PaymentResponse = response;
      req.PaymentOption ='paynow';
      next();
    }else{
      res.status(400).json({message:'Failed To Create Payment',error:response.response.error});
    }
  }else if(req.body.OtherPayments){
    req.PaymentOption=req.body.OtherPayments.payment;
    next();
  }else{
    res.status(500).json({message:'Invalid Sign Up Payment Details'});
  }
})

module.exports = SignUp;
