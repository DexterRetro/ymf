mongoose = require('mongoose');

const scheme = new mongoose.Schema({
  ItemName:{type:String,required:true},
  ItemType:{type:String,enum: ['membership','payments','merch',],default:'membership'},
  ItemPrice:{type:Number,required:true},
})

const priceModel = mongoose.model('item',scheme,'itemPrices');
module.exports = priceModel;


