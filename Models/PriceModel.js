mongoose = require('mongoose');

const scheme = new mongoose.Schema({
  ItemName:{type:String,required:true},
  ItemType:{type:String,enum: ['general-membership','registration-fees','corporate-membership'],default:'general-membership'},
  ItemPrice:{type:Number,required:true},
})

const priceModel = mongoose.model('price',scheme,'itemPrices');
module.exports = priceModel;


