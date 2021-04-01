const Joi = require('joi').extend(require('@joi/date'));;
const moment = require('moment')

const customerValidation = data => {
  const schema  = Joi.object({
      firstName: Joi.string().required(),
      panNumber:  Joi.string().pattern(new RegExp('[A-Z]{5}[0-9]{4}[A-Z]{1}')).required(),
      email: Joi.string().email().lowercase().required(),
      gender: Joi.string().required(),
      profileImage: Joi.string().required(),
      dob: Joi.date().format('YYYY/MM/DD'), 
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  })
  return  schema.validate(data);
};


const loginValidation = data => {
  console.log(data)
  const schema  = Joi.object({
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  })
  return  schema.validate(data);
};


const customerUpdateValidation = data => {
  const schema  = Joi.object({
      firstName: Joi.string().required(),
      panNumber:  Joi.string().pattern(new RegExp('[A-Z]{5}[0-9]{4}[A-Z]{1}')).required(),
      email: Joi.string().email().lowercase().required(),
      gender: Joi.string().required(),
      profileImage: Joi.string().required(),
      dob: Joi.date().format('YYYY/MM/DD'), 
  })
  return  schema.validate(data);
};

module.exports.customerValidation = customerValidation;
module.exports.loginValidation = loginValidation;
module.exports.customerUpdateValidation = customerUpdateValidation;
