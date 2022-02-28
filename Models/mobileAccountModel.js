mongoose = require('mongoose');
const scheme = mongoose.Schema({
    mobileNumber:{type:String,required:true},
    AccountId:{type:String},
    Verified:{type:Boolean,require:true,default:false}
})

const mobileAcount = mongoose.model('mobileAcount',scheme,'mobileAccounts');
module.exports = mobileAcount; 