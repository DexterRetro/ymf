const CatchAsync = require("../utils/CatchAsync");
var path = require('path');
var mime = require('mime');
var fs = require('fs');
const gallery = require('../Models/galleryModel')
const DPCM = require('../Models/dropBoxCredentialsModel');
const dropboxV2Api = require('dropbox-v2-api');
const { Readable } = require('stream');

exports.InitialiseDropBox = async()=>{
  const dropbox = dropboxV2Api.authenticate({
    client_id: process.env.DBX_APP_KEY,
    client_secret: process.env.DBX_APP_SECRET,
    redirect_uri: process.env.REDIRECT_URL,
    token_access_type: 'offline', // if you need an offline ling-living refresh token
    //state: 'OPTIONAL_STATE_VALUE'
  });
  const currentCredentials =await DPCM.findOne();
  if(currentCredentials){
    if(currentCredentials.ExpiresAt<=Date.now()){
      dropbox.refreshToken(currentCredentials.RefreshToken, async(err, result, response) => {
        //token is refreshed!
        const currentCredentials =await DPCM.findOne();
        currentCredentials.AccessToken= result.access_token;
        currentCredentials.ExpiresAt=Date.now()+result.expires_in;
        await currentCredentials.save();
    });
    }
  }else{
  //generate and visit authorization sevice
  const authUrl = dropbox.generateAuthUrl();
  console.log(authUrl);
  }
}
async function getDropBoxInstance(){
  const currentCredentials =await DPCM.findOne();
  if(currentCredentials.ExpiresAt<=Date.now()){
    await RefreshToken();
    return dropbox = dropboxV2Api.authenticate({token:currentCredentials.AccessToken})
  }
  return dropbox = dropboxV2Api.authenticate({token:currentCredentials.AccessToken})
}
async function getDetails(){
  const dropbox = await getDropBoxInstance();
  dropbox({
    resource: 'users/get_current_account'},
    (err, result, response) => {
    if (err) { return console.log('err:', err); }
    console.log(result);
  });
}
async function RefreshToken(){
  const currentCredentials =await DPCM.findOne();
  const dropbox = dropboxV2Api.authenticate({
    client_id: process.env.DBX_APP_KEY,
    client_secret: process.env.DBX_APP_SECRET,
    redirect_uri: process.env.REDIRECT_URL,
    token_access_type: 'offline', // if you need an offline ling-living refresh token
    //state: 'OPTIONAL_STATE_VALUE'
  });
  return new Promise((resolve, reject) => {
    if(currentCredentials.ExpiresAt<=Date.now()){
      dropbox.refreshToken(currentCredentials.RefreshToken, async(err, result) => {
        //token is refreshed!
        if(err){
          reject(err);
        }
        const currentCredentials =await DPCM.findOne();
        currentCredentials.AccessToken= result.access_token;
        currentCredentials.ExpiresAt=Date.now()+result.expires_in;
        await currentCredentials.save();
        resolve(result);
    })
      
    }
  })
  
}

exports.GetFile = CatchAsync(async(req,res,next)=>{
  if(!req.query){
    return res.status(400).json({message:'File Query Not Valid'});
  }
  let FilePath =''
  if(!req.query.id){
    FilePath= `/${req.query.folder}/${req.query.filename}`;
    
  console.log(FilePath);
  const dropbox = await getDropBoxInstance();
  const stream = dropbox({
    resource: 'files/download',
    parameters: {path: FilePath}
    }, 
    (err, result, response) => {
    //download completed
    });
    res.attachment(req.query.filename);
    stream.pipe(res);
  }else{
     const imageFile = await gallery.findOne({_id:req.query.id});
     if(!imageFile){
      return res.status(400).json({message:'File Query Not Valid'});
     }
     FilePath= `/${imageFile.PictureUrl}`;
     
  console.log(FilePath);
  const dropbox = await getDropBoxInstance();
  const stream = dropbox({
    resource: 'files/download',
    parameters: {path: FilePath}
    }, 
    (err, result, response) => {
    //download completed
    });
    res.attachment(imageFile.PictureName);
    stream.pipe(res);
  }

})

exports.UploadFile = async(fileBuffer,fileType,fileName)=>{
  const dropbox = await getDropBoxInstance();
  const dropboxUploadStream = dropbox({
    resource: 'files/upload',
    parameters: {
        path: `/${fileType}/${fileName}`
    }

}, (err, result, response) => {
    //upload completed
});
const stream = Readable.from(fileBuffer.toString());
stream.pipe(dropboxUploadStream);
return  `${fileType}/${fileName}`;
}

exports.AuthDP = CatchAsync(async(req,res,next)=>{
  var params = req.query;
  //after redirection, you should receive code
  const dropbox = dropboxV2Api.authenticate({
    client_id: 'uq9f1dnwgjd673k',
    client_secret: 'vhs9ypk9w9t8fhn',
    redirect_uri: 'http://localhost:3000/auth',
    token_access_type: 'offline', // if you need an offline ling-living refresh token
    //state: 'OPTIONAL_STATE_VALUE'
  });
  dropbox.getToken(params.code, async(err, result, response) => {
  // you are authorized now!
  await DPCM.create({
  AccessToken:result.access_token,
  TokenType:result.token_type,
  ExpiresAt:Date.now()+result.expires_in,
  RefreshToken:result.refresh_token,
  AccountID:result.account_id,
  UiD:result.uid
  })
  // ...then you can refresh your token! (flow for token_access_type='offline')
  await RefreshToken();
});
})
