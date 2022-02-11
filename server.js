const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


let constring = '';
if(process.env.NODE_ENV==='development'){
  constring = process.env.LOCAL_DB;
}else if(process.env.NODE_ENV==='production'){
  const dbString = process.env.CLOUD_DB;
  constring = dbString.replace(
    '<password>',
    process.env.CLOUD_DB_PASSWORD
  );

}
const port = process.env.PORT || 3000;

console.log(`Connecting To DataBase.....`);
mongoose.connect(constring, { 
    useNewUrlParser: true,
  }).then(
      app.listen(port,()=>{
    console.log(`Server started Succesfully. listening on port ${port}... `);
})).catch(err=>{
  console.log(err);
})
