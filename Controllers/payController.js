// Require in the Paynow class
const { Paynow } = require("paynow");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const user = require('./userController')
const price = require('../Models/PriceModel')
const finance = require('../Models/financialModel')
const PayNowKey = process.env.PAYNOW_KEY;
const PayNowID = process.env.PAYNOW_ID;
let paynow = new Paynow(PayNowID,PayNowKey);

exports.Pay = async(Cart,userName,userPhoneNumber)=>{

// Create instance of Paynow class
const Items = Cart;
const Invoice = `YMFPay_${userName}_${Date.now()}`;
const conRate = await finance.find();
paynow.resultUrl = `http://7f10-197-221-255-110.ngrok.io/api/regpaypoll/${Invoice}_${userPhoneNumber}`;
// Create a new payment
let payment = paynow.createPayment(Invoice);

// Add items to the payment list passing in the name of the item and it's price
Items.forEach(element => {
  payment.add(element.name, element.price*conRate[0].conversionRate);
});
// Send off the payment to Paynow
const response = await paynow.send(payment);
return response;

}

exports.CheckSuccess = async(req,res,next)=>{
  const PaymentPollURL = req.body.paymentPollUrl;
  if(PaymentPollURL){
    const result = await paynow.pollTransaction(PaymentPollURL);
    const RegResults = await user.RegisterUser(req.body.user.phoneNumber,`YMFPay_${req.body.user.userName}_${Date.now()}`);
    res.status(200).json({message:'Poll Results',PollResult:result,token:RegResults.token,user:RegResults.user});
  }else{
    res.status(404).json({message:'no poll Url found/ invalid poll url',PollResult:{success:false},token:undefined});
  }

}

exports.RegPaymentResult = async(req,res,next)=>{
  const details = req.params.id;

  const userPhoneNumber = details.split('_')[3];

  await user.RegisterUser(userPhoneNumber,details);

  res.status(200).json({message:'received payment Update'});
}

exports.PollResults = async(PaymentPollURL)=>{
  return await paynow.pollTransaction(PaymentPollURL);
}

exports.GetPaymentAmount = async(req,res,next)=>{
    const price = await price.findOne({ItemType:req.body.ItemType});
    if(!price){
      res.status(404).json({message:'cannot find price',price:undefined});
    }
    res.status(200).json({message:'price found',price});
}

exports.PaySubscription = async(req,res,next)=>{
  const membershipType = req.body.membershipType;
  if(!membershipType){
    res.status(400).json({message:'invalid membershipType'});
  }
  const paymentItem = await price.findOne({ItemType:membershipType});
  if(!paymentItem){
    res.status(404).json({message:'payment details not available'});
  }
  const receipt = await this.Pay({name:paymentItem.ItemName,price:paymentItem.ItemPrice});
  if(!receipt){
    res.status(500).json({message:'error in creating payment'});
  }
  res.status(200).json({message:`Successfully created payment`,PaymentUrl:receipt.redirectUrl});
}
