mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');


 const scheme = new mongoose.Schema({
     userName:{type:String,required:[true,'User Name Required']},
     userSurname:{type:String,required:[true,'User Surname Required']},
     YMFID:{type:String},
     role: {type: String,enum: ['student', 'general-member', 'board-member', 'admin'],default: 'general-member',},
     password: {type: String,required: [true, 'pasword is required'],minlength: 8,select:false,},passwordChangedAt: {type: Date,},
     passwordConfirm: {type: String,required: [true, 'paswordConfirm is required'],minlength: 8,
        validate: {
          validator: function (el) {
            return el === this.password;
          },
          message: 'Passwords Dont  Match',
        },
      },
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
      Registered:{type:Boolean,default:false},
      RegistrationPollURL:{type:String},
      PaymentRecord:{type:[{PaymentPurpose:String,PaymentDate:Date,PaymentRef:String}]},
      MembershipSubscriptionDate:{type:Date,default:Date.now()},
      MembershipExpireryDate:{type:Date,default:Date.now()+(1000*60*60*24*30)},
      Notifications:[{NotHeader:String,NotContent:String,NotExpirery:Date}]
 });

scheme.pre('save',async function(next){
   if(!this.isModified('password')){
       return next();
   }
   this.password = await bcrypt.hash(this.password,12);
   this.passwordConfirm = undefined;
   next();
});

scheme.pre('save',async function(next){
    if(!this.YMFID===null){
        return next();
    }
    this.YMFID =`YMF${GetProvinceID(this.Province)}${new Date().getFullYear()}`;
    next();
 });

scheme.methods.correctPassword= async(enteredPassword,savedPassword)=>{
    return await bcrypt.compare(enteredPassword,savedPassword);
}

const GetProvinceID=(province)=>{
    switch (province) {
        case 'Bulawayo Province':
            return "01";
        case 'Harare Province':
            return "02";
        case 'Manicaland Province':
            return "03";
        case 'Mashonaland Central Province':
            return "04";
        case 'Mashonaland East Province':
            return "05";
        case 'Mashonaland West Province':
            return "06";
        case 'Masvingo Province':
            return "07";
        case 'Matabeleland North Province':
            return "08";
        case 'Matabeleland South Province':
            return "09";
        case 'Midlands Province':
            return "10";
    }
}

 const user = mongoose.model('User',scheme,'user');
 module.exports = user;
