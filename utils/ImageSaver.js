const jimp = require('jimp');
const mime = require('mime-types');

exports.SaveImage = async(imageURL,fileName,filePath)=>{
    const buffer = Buffer.from(imageURL,"base64");
    const res = await jimp.read(buffer).catch(err=>{
        if(err){
            return 'error';
        }
    })
    return res.write(`${filePath}/${fileName}`);
}

exports.GetImageSavename = (filename,mimeInfo)=>{
    return `${filename}.${mime.extension(mimeInfo)}`;
}
