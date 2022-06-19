mongoose = require('mongoose');

const scheme = new mongoose.Schema({
  AccessToken:{type:String,required:true},
  TokenType:String,
  ExpiresAt:Date,
  RefreshToken:{type:String,required:true},
  AccountID:String,
  UiD:String
})

const dpc = mongoose.model('dropboxAccount',scheme,'DropboxAccount');
module.exports = dpc;
