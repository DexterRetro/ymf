const pay = require('../Controllers/payController')
const itemModel = require('../Models/ItemModel');
const CatchAsync = require('../utils/CatchAsync');

//creates payment and forwards to account creation
const SignUp = CatchAsync(async(req,res,next)=>{
  const price = await itemModel.findOne({ItemType:'Registration'});
  const response = await pay.PayMobile([{name:price.ItemName,price:price.ItemPrice}],`${req.body.userName} ${req.body.userSurname}`,req.body.phoneNumber,req.body.userEmail,'New Member Registration');
  if(response.success){
    req.PaymentResponse = response;
    next();
  }
});

module.exports = SignUp;
