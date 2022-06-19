const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var path = require('path');
const fileUpload = require('express-fileupload');
const errorController = require('./Middlewares/ErrorCatch');
const DPAuth = require('./Controllers/FileCloudController')

const routes = require('./Routes')

const app = express();


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use(morgan('combined'));

app.use(express.json());
app.use(fileUpload());
DPAuth.InitialiseDropBox();

app.get('/auth',DPAuth.AuthDP);
app.use('/api',routes);
app.use('/documents',express.static(path.join(__dirname,'documents')));
app.all('*', (req, res) => {
  res.status(400).json({message:`URL:${req.originalUrl} doesnt exist`});
});
app.use(errorController);

module.exports = app;
