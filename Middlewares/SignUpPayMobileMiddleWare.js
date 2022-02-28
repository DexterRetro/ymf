const pay = require('../Controllers/payController')
const priceModel = require('../Models/PriceModel');
const CatchAsync = require('../utils/CatchAsync');

//creates payment and forwards to account creation
const SignUp = CatchAsync(async(req,res,next)=>{
  const price = await priceModel.findOne({ItemType:'registrationfees'});
  const response = await pay.PayMobile([{name:price.ItemName,price:price.ItemPrice}],req.body.userName,req.body.phoneNumber,req.body.userEmail);
  if(response.success){
    req.PaymentResponse = response;
    next();
  }
});

module.exports = SignUp;