mongoose = require('mongoose');
const scheme = mongoose.Schema({
  conversionRate:Number,
})
const finance = mongoose.model('finance',scheme,'financialInfo');
module.exports = finance;
