mongoose = require('mongoose');

 const scheme = new mongoose.Schema({
    NAME:{type:String,required:[true,'User Name Required']},
    MEMBERSHIP_NUMBER:{type:String,required:[true,'User Name Required']},
    ID_NUMBER:{type:String,required:[true,'User Name Required']},
    CHAPTER:{type:String,required:[true,'User Name Required']},
    ADDRESS:{type:String,required:[true,'User Name Required']},
    PHONE_NUMBER:{type:String,required:[true,'User Name Required']},
    DATE_OF_BIRTH:{type:String,required:[true,'User Name Required']},
 });
 const user = mongoose.model('OldUser',scheme,'oldUser');
 module.exports = user;
