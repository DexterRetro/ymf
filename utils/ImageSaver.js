const jimp = require('jimp');
const mime = require('mime-types');
const DB = require('../Controllers/FileCloudController')

exports.SaveImage = async(imageURL,fileName,fileType)=>{
    const buffer = Buffer.from(imageURL,"base64");
   // 
    return await DB.UploadFile(buffer,fileType,fileName);
}

exports.GetImageSavename = (filename,mimeInfo)=>{
    return `${filename}.${mime.extension(mimeInfo)}`;
}
