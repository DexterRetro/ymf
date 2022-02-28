const WordExtractor = require("word-extractor"); 
const fs = require('fs/promises')

exports.ReadDocument=async(fileUrl)=>{
    const extractor = new WordExtractor();

    return await extractor.extract(fileUrl);
}