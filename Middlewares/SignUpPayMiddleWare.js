const UserModel= require('../Models/userModel');
const pay = require('../Controllers/payController')
const priceModel = require('../Models/PriceModel')

//creates payment and forwards to account creation
const SignUp = async(req,res,next)=>{
  const price = await priceModel.findOne({ItemType:'registrationfees'});
  const response = await pay.Pay([{name:price.ItemName,price:price.ItemPrice}],req.body.userName,req.body.phoneNumber);
  if(response.success){
    req.PaymentResponse = response;
    next();
  }
}

module.exports = SignUp;
