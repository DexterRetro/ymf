mongoose = require('mongoose');

const scheme = new mongoose.Schema({
    customer:{type:String,required:true},
    date:{type:Date,required:true,default:Date.now()},
    amount:{type:String,required:true},
    currency:{type:String,enum:['ZWL','USD'],required:true},
    refcode:{type:String,required:true},
    contacts:{type:String},
    paymentPlatform:{type:String,required:true,enum:['paynow','ecocash','onemoney','banktransfer','mkuru','telecash']},
    status:{type:String,required:true,enum:['pending','complete','removed']},
    purpose:{type:String,required:true}
})

const transactionModel = mongoose.model('transactions',scheme,'Transactions');
module.exports = transactionModel;
