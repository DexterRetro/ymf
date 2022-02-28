mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');


 const scheme = new mongoose.Schema({
     userName:{type:String,required:[true,'User Name Required']},
     userSurname:{type:String,required:[true,'User Surname Required']},
     YMFID:{type:String},
     role: {type: String,enum: ['general-member', 'board-member', 'admin'],default: 'general-member',},
     extraRoles:{type: String,enum: ['editor', 'accounting', 'IT','registra']},
     password: {type: String,required: [true, 'pasword is required'],minlength: 8,select:false,},passwordChangedAt: {type: Date,},
     passwordResetToken: String,
     passwordResetExpires: Date,
     email: {type: String,unique: true,validate: [validator.isEmail, 'please enter a valid Email']},
     phoneNumber: {type: String,required: [true, 'phone number is Required'],unique: true,},
     IDNumber: {type: String,required: [true, 'National Identity is Required'],},
     Province: {type: String,
                enum: [
                'Bulawayo Province',
                'Harare Province',
                'Manicaland Province',
                'Mashonaland Central Province',
                'Mashonaland East Province',
                'Mashonaland West Province',
                'Masvingo Province',
                'Matabeleland North Province',
                'Matabeleland South Province',
                'Midlands Province'],
      },
      ProfilePhoto: {type: String,default: 'noProfile.jpg',},
      PaymentRecord:{type:[{PaymentPurpose:String,PaymentDate:Date,PaymentRef:String}]},
      MembershipSubscriptionDate:{type:Date,default:Date.now()},
      MembershipExpireryDate:{type:Date,default:Date.now()+(1000*60*60*24*28)},
      Notifications:[{NotHeader:String,NotContent:String,NotExpirery:Date}]
 });

scheme.methods.correctPassword= async(enteredPassword,savedPassword)=>{
    return await bcrypt.compare(enteredPassword,savedPassword);
}


 const user = mongoose.model('User',scheme,'user');
 module.exports = user;
