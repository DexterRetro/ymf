const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorController = require('./Middlewares/ErrorCatch');



const routes = require('./Routes')

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));


app.use(express.json());
app.use('/api',routes);
app.all('*', (req, res) => {
  res.status(400).json({message:`URL:${req.originalUrl} doesnt exist`});
});
app.use(errorController);

module.exports = app;
