mongoose = require('mongoose');

const scheme = new mongoose.Schema({
    customer:{type:String,required:true},
    amount:{type:String,required:true},
    refcode:{type:String,required:true},
    contacts:{type:String,required:true},
    paymentPlatform:{type:String,required:true},
    status:{type:String,required:true},
    purpose:{type:String,required:true}
})

const transactionModel = mongoose.model('transactions',scheme,'Transactions');
module.exports = transactionModel;