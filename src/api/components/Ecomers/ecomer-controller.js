const ecomerService = require('./ecomer-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProducs(request, response, next){
  try{
    const producs = await ecomerService.getProducs();
    return response.status(200).json(producs);
  }catch(error){
    return next(error)
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getProduc(request, response, next){
  try{
    const produc = await ecomerService.getProduc(request.params.id);

    if (!produc){
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, "Uknown Item");
    }

    return response.status(200).json(produc);
  }catch (error){
    return nect (error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduc(request, response, next){
  try {
  const producName = request.body.producName;
  const producQuantity = request.body.producQuantity;
  const producPrice = request.body.producPrice;
  const producDesc = request.body.producDesc;

  const nameIsRegistered = await ecomerService.nameIsRegistered(producName);
  if(nameIsRegistered){
    throw errorResponder(
      errorTypes.NAME_ALREADY_TAKEN,
      'Product Already Rigesterd'
    )
  }

  const success = await ecomerService.createProduc(producName, producQuantity, producPrice, producDesc);
  if (!success){
    throw errorResponder(
      errorTypes.UNPROCESSABLE_ENTITY,
      'Failed to create Product'
    )
  }

  return response.status(200).json({producName, producPrice, producDesc});
}catch (error){
  return next (error);
}
}

async function modifyQuantity (request, response){
  try{
    const id = request.params.id;
    const{  newQuantity, email, password, } = request.body;

    await ecomerService.adminLogin( email );
    await ecomerService.adminPassword ( email, password );

    const update = await ecomerService.modifyQuantity(id, newQuantity);

    response.status(200).json({ update });
  }catch (error){
    response.status(401).json({ error: error.message });
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduc(request, response, next) {
  try {
    const id = request.params.id;

    const success = await ecomerService.deleteProduc(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete product'
      );
    }else {
      'Delete Sucess'
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducs,
  getProduc,
  createProduc,
  modifyQuantity,
  deleteProduc,
}