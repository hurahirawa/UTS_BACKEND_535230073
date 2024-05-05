const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const ecomerController = require ('./ecomer-controller');
const ecomerValidator = require ('./ecomer-validator');

const route = express.Router()

module.exports = (app) => {
  app.use('/Ecomers', route);

  route.get('/', authenticationMiddleware, ecomerController.getProducs);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(ecomerValidator.createProduc),
    ecomerController.createProduc
  );

  route.get('/:id', authenticationMiddleware, ecomerController.getProduc);

  route.delete('/:id/delete', authenticationMiddleware, ecomerController.deleteProduc);

  route.put(
    '/:id/cQuan',
    authenticationMiddleware,
    celebrate(ecomerValidator.modifyQuantity),
    ecomerController.modifyQuantity
  );
}