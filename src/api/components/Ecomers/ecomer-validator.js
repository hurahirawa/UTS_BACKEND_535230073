const Joi = require('joi');

module.exports = {
  createProduc: {
    body : {
      producName : Joi.string().min(1).max(100).required().label('producName'),
      producQuantity : Joi.number().integer().required().label('producQuantity'),
      producPrice : Joi.number().integer().required().label('producPrice'),
      producDesc : Joi.string().min(1).max(400).required().label('producDesc'),
    },
  },

  modifyQuantity: {
    body : {
      email : Joi.string().min(1).max(100).required().label('email'),
      password : Joi.string().min(1).max(100).required().label('password'),
      newQuantity : Joi.number().integer().required().label('newQuantity'),
    },
  },
}