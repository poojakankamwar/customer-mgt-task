const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const Joi = require('joi');

// For salting passwords
const SALT_WORK_FACTOR = 10;

// Customer schema
const CustomerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  panNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
});

// Hash and salt passwords before saving to db
CustomerSchema.pre("save", function(next) {
  const customer = this;
  customer.email = customer.email && customer.email.toLowerCase();
  if (customer.isModified("password")) {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) return next(err);
      // Hash
      bcrypt.hash(customer.password, salt, (err, hash) => {
        if (err) return next(err);
        // Set password to be the hashed one
        customer.password = hash;
        next();
      });
    });
  }  else {
    return next();
  }
});

// Instance method to check if the password entered matches the password in the db
CustomerSchema.methods.authenticate = function(enteredPassword) {
  console.log("enteredPassword",enteredPassword);
    return new Promise((resolve, reject) =>
      bcrypt.compare(enteredPassword, this.password, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    );
  };

// When sending data from db to anywhere, send everything except password
CustomerSchema.set("toJSON", {
  transform(doc, ret, options) {
    return _.omit(ret, ["password"]);
  }
});

module.exports = mongoose.model("Customer", CustomerSchema);
