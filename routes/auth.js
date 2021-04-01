const express = require('express');
const auth = express.Router();
const jwt = require("jsonwebtoken");
const Customers = require("../models/customer");
const {customerValidation, loginValidation, customerUpdateValidation} = require("../validation");
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const verifyToken = require("./verifyToken.js");


//multer upload file code
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now()+'-' + file.originalname)
  }
});
const upload = multer({ storage: storage });


// customer registraation
auth.post("/customerSignup", upload.single('filename'), async (req, res, next) => {
  if(req.file){
      req.body.profileImage =  req.file.filename;
  }
  const {error} = customerValidation(req.body);
  if(error)
  return res.json({ success: false, message: error.details[0].message });

  const email = req.body.email.toLowerCase();
  Customers.findOne({ "email": email })
    .exec()
    .then(customer => {
      if (customer)
        throw new Error(
          "An account with that email already exists."
        );
        else
        return Customers.create(req.body);
    })
    .then(customer => {
          return res
            .status(201)
            .json({ success: true, customer, message:"Registration Successful"  });
    })
    .catch(err => {
      console.log(err);
      return res.json({ success: false, message: err.message });
    });
});



// customer login
auth.post("/login", async(req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  const {error} = loginValidation(req.body);
  if(error){
    return res.json({ success: false, message:  error.details[0].message });
  }
  Customers.findOne({ email })
    .exec()
    .then(customer => {
      if (customer) return customer;
    })
    .then(result =>{
      return Promise.all([result.authenticate(password), result]);
    })
    .then(result1 => {
      if (!result1[0] === true) {
        return res.json({
          success: false,
          message:
            "The login information you entered is incorrect. Please try again."
        });
      }
      const token = jwt.sign({ id: result1[1]._id }, process.env.APP_SECRET);
      res.header('auth-token', token).send({token,  message:"Login Successful", login:result1[1], success:true });
    })
    .catch(err => {
      return res.json({
        success: false,
        message: "Something went wrong. Please try again.",
        err: err
      });
    });
});


// Delete account 
auth.delete("/:id", verifyToken, (req, res, next) => {
    Customers.findByIdAndRemove(req.params.id)
      .exec()
      .then(customer =>
        res.json({
          success: true,
          message: "Your account has successfully been deleted."
        })
      )
      .catch(err => {
        console.log(err);
        return res.json({
          success: false,
          message:
            "There was an error in deleting your account. Please try again later."
        });
      });

});


// Get customer by Id
auth.get("/:id", verifyToken, (req, res, next) => {
  Customers.findById(req.params.id)
    .exec()
    .then(customer => {
      if (!customer)
        return res.json({
          success: false,
          message: "Customer could not be found."
        });
      return res.json({ success: true, customer });
    })
    .catch(err => {
      console.log(err);
      return res.json({ success: false, message: "Customer could not be found." });
    });
});



// Update customer info
auth.patch("/:id/update",verifyToken, upload.single('filename'), (req, res, next) => {
  var body = req.body;
  if(req.file){
    body.profileImage = req.file.filename;
  }
  Customers.findById(req.params.id)
    .exec()
    .then(customer => {
      const {error} = customerUpdateValidation(body);
      if(error)
      return res.json({ success: false, message: error.details[0].message });

      if (body.firstName) customer.firstName = body.firstName;
      if (body.email) customer.profilePhoto = body.email;
      if (body.firstName) customer.firstName = body.firstName;
      if (body.gender) customer.gender = body.gender;
      if (body.dob) customer.dob = body.dob;
      if (body.panNumber) customer.panNumber = body.panNumber;
      if (body.profileImage) customer.profileImage = body.profileImage;
      if(req.file){
        body.profileImage = req.file.filename;
      }
      return customer.save();
    })
    .then(customer => res.json({ success: true, customer }))
    .catch(err => {
      console.log(err);
      return res.json({
        success: false,
        message: "Could not save updated information."
      });
    });
});


module.exports = auth;
