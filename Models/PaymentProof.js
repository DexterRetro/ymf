mongoose = require('mongoose');

const scheme = new mongoose.Schema({
  PaymentPlatform:{
      type:String,
    required:true,},
  Amount:{type:String,required:true},
  Purpose:{type:String,required:true},
  RefCode:{type:String,required:true},
  DateOfUpload:{type:Date,default:Date.now()}
})

const paymentProof = mongoose.model('paymentProof',scheme,'PaymentProof');
module.exports = paymentProof;