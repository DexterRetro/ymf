// Require in the Paynow class
const { Paynow } = require("paynow");
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const user = require('./userController')
const price = require('../Models/PriceModel')
const finance = require('../Models/financialModel');
const CatchAsync = require("../utils/CatchAsync");
const PayNowKey = process.env.PAYNOW_KEY;
const PayNowID = process.env.PAYNOW_ID;
let paynow = new Paynow(PayNowID,PayNowKey);
const paymentProof = require('../Models/PaymentProof');
const transactionModel = require('../Models/TransactionsModel')

exports.Pay =  async(Cart,userName,userPhoneNumber,purpose)=>{

// Create instance of Paynow class
const Items = Cart;
const Invoice = `YMFPay_${new Date(Date.now()).toISOString()}`;
const conRate = await finance.find();
paynow.resultUrl = `${process.env.DEVURL}/api/payupdate/${Invoice}`;
// Create a new payment
let payment = paynow.createPayment(Invoice);
let TotalPayed =0;
// Add items to the payment list passing in the name of the item and it's price
Items.forEach(element => {
  payment.add(element.ItemName, element.ItemPrice*conRate[0].conversionRate);
  TotalPayed+=element.ItemPrice*conRate[0].conversionRate;
});
await transactionModel.create({
  customer:userName,
  amount:TotalPayed,
  refcode:Invoice,
  contacts:userPhoneNumber,
  paymentPlatform:'paynow',
  status:'pending',
  purpose:purpose});
// Send off the payment to Paynow
const response = await paynow.send(payment);
return {response,Invoice};

}

exports.PayMobile = async(Cart,userName,userPhoneNumber,userEmail,purpose)=>{
  // Create instance of Paynow class
const Items = Cart;
const Invoice = `YMFPay_${new Date(Date.now()).toISOString()}`;
const conRate = await finance.find();
paynow.resultUrl = `${process.env.DEVURL}/api/payupdate/${Invoice}`;
// Create a new payment
let payment = paynow.createPayment(Invoice,userEmail);

let TotalPayed=0;
// Add items to the payment list passing in the name of the item and it's price
Items.forEach(element => {
  payment.add(element.name, element.price*conRate[0].conversionRate);
  TotalPayed+=element.price*conRate[0].conversionRate;
});
await transactionModel.create({
  customer:userName,
  amount:TotalPayed,
  refcode:Invoice,
  contacts:`Phone: ${userPhoneNumber} Email: ${userEmail}`,
  paymentPlatform:'paynow',
  status:'pending',
  purpose:purpose});
// Send off the payment to Paynow
const response = await paynow.sendMobile(payment,userphoneNumber,getPhoneNetwork(userPhoneNumber));
return {response,Invoice};
}

exports.CheckSuccess = CatchAsync(async(req,res,next)=>{
  const User = req.body.user;
  if(!User){
    return res.status(404).json({message:'no poll Url found/ invalid poll url',PollResult:{success:false},token:undefined});
  }
  const result = await paynow.pollTransaction(User.RegistrationReceipt.PollUrl);
  const RegResults = await user.RegisterUser(User.RegistrationReceipt.RefCode,result);
  if(!RegResults){
    return res.status(400).json({message:'failed to register',PollResult:{success:false},token:undefined});
  }
  res.status(200).json({message:'Poll Results',PollResult:result,token:RegResults.token,user:RegResults.newUser});

})

exports.RegPaymentResult = CatchAsync(async(req,res,next)=>{
  const details = req.params.id;
  await user.RegisterUser();
  console.log('poled payment')
  res.status(200).json({message:'received payment Update'});
})

exports.PollResults = async(PaymentPollURL)=>{
  return await paynow.pollTransaction(PaymentPollURL);
}

exports.GetPaymentAmount = CatchAsync(async(req,res,next)=>{
    const price = await price.findOne({ItemType:req.body.ItemType});
    if(!price){
      res.status(404).json({message:'cannot find price',price:undefined});
    }
    res.status(200).json({message:'price found',price});
})

exports.AddPaymentProof = CatchAsync(async(req,res,next)=>{
    const {payment,refCode,amount,purpose} = req.body;
    if(!payment||!refCode||!amount||!purpose){
      return res.status(400).json({message:'in valid Payment Details'});
    }

    const Record = await paymentProof.create({PaymentPlatform:payment,Amount:amount,Purpose:purpose,RefCode:refCode,});
   if(!Record){
    return res.status(500).json({message:'failed to create record'});
   }
res.status(200).json({message:'success. created Record'});

})

exports.PaySubscription = CatchAsync(async(req,res,next)=>{
  const membershipType = req.membershipType;
  const user = req.User;
  if(!membershipType){
    res.status(400).json({message:'invalid membershipType'});
  }
  const paymentItem = await price.findOne({ItemType:membershipType});
  if(!paymentItem){
    res.status(404).json({message:'payment details not available'});
  }
  const receipt = await this.Pay({name:paymentItem.ItemName,price:paymentItem.ItemPrice},`${user.userName} ${user.userSurname}`,user.phoneNumber,'Subscription Payment');
  if(!receipt){
    res.status(500).json({message:'error in creating payment'});
  }
  res.status(200).json({message:`Successfully created payment`,PaymentUrl:receipt.redirectUrl});
})

function getPhoneNetwork (number){
  const first3 = number.substring(0,3);
  if(first3==='071'){
   return 'onemoney';
  }
  else if(first3===('077'||'078')){
    return 'ecocash'
  }
  return '';
}