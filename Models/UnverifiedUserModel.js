mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');


 const scheme = new mongoose.Schema({
     userName:{type:String,required:[true,'User Name Required']},
     userSurname:{type:String,required:[true,'User Surname Required']},
     password: {type: String,required: [true, 'pasword is required'],minlength: 8,},passwordChangedAt: {type: Date,},
     passwordConfirm: {type: String,required: [true, 'paswordConfirm is required'],minlength: 8,
        validate: {
          validator: function (el) {
            return el === this.password;
          },
          message: 'Passwords Dont  Match',
        },
      },
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
      RegistrationReceipt:{
        type:{payementOption:String,
          RefCode:String,
          PollUrl:String,
          dateOfupload:{type:Date,default:Date.now()}
        }}

 });

scheme.pre('save',async function(next){
   if(!this.isModified('password')){
       return next();
   }
   this.password = await bcrypt.hash(this.password,12);
   this.passwordConfirm = undefined;
   next();
});

 const user = mongoose.model('UnverifiedUser',scheme,'unverifiedUsers');
 module.exports = user;
