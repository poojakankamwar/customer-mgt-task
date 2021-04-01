require("dotenv").config({});
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const Customers = require("./models/customer");
const customersRouter = require('./routes/customers');
const port = process.env.PORT;
const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/customers', customersRouter);
app.use("/auth", require("./routes/auth"))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.use(helmet());
app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// DB setup
mongoose.connect(
  process.env.MONGO_ATLAS, { useUnifiedTopology: true, useNewUrlParser: true } ,
  err => {
    if (err) console.log("*** Error connecting to db *** \n", err);
    else console.log("--- Successfully connected to db ---");
  }
);

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Starting server
app.listen(port, () => {
  console.log('--- Listening on port 3000 ---');
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});