const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

let constring = process.env.LOCAL_DB;
const port = 3000;

console.log(`Connecting To DataBase.....`);
mongoose.connect(constring, {
    useNewUrlParser: true,
  }).then(
      app.listen(port,()=>{
    console.log(`Server started Succesfully. listening on port ${port}... `);
}))
