const ecomerRepository = require('./ecomer-repository');
const usersRepository = require ('../users/users-repository');
const { Product } = require('../../../models')
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * get list of produc
 * @returns {Array}
 */
async function getProducs() {
  const products = await ecomerRepository.getProducs();

  const Library = [];
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    Library.push({
      id: product.id,
      producName: product.producName,
      producDesc: product.producDesc,
    });
  }

  return Library;
}

/**
 * Get product detail
 * @param {string} id - product ID
 * @returns {Object}
 */
async function getProduc(id){
  const product = await ecomerRepository.getProduc(id);

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    producName: product.producName,
    producPrice : product.producPrice,
    producDesc : product.producDesc,
  };
}

/**
 * Create new product
 * @param {string} producName - produc name
 * @param {Number} producQuantity - how many product on warehouse
 * @param {Number} productPrice - price of product
 * @param {string} productDesc - product description
 * @returns {Promise}
 */
async function createProduc (producName, producQuantity, producPrice, producDesc){
  try{
    await ecomerRepository.createProduc(producName, producQuantity, producPrice, producDesc);
  }catch (err){
    return null;
  }

  return true;
}

async function adminLogin(email){
  const user = await usersRepository.getUserByEmail(email);

  if (user.email !== 'admin@example.com'){
    throw errorResponder(errorTypes.NOT_ADMIN, "Uknown Admin")
  }

  return user;
}

async function adminPassword (email, password){
  const userInfo = await adminLogin(email);

  if(!userInfo){
    return false
  }

  if(userInfo.password !== password){
    return false
  }

  return true
}

/**
 * Check whether the produc is registered
 * @param {string} producName - nama produc
 * @returns {boolean}
 */
async function nameIsRegistered(producName) {
  const produc = await ecomerRepository.getProducByName(producName);

  if (produc) {
    return true;
  }

  return false;
}

async function modifyQuantity(id, newQuantity) {
  const produc = await ecomerRepository.getProduc(id);

  if (!produc) {
    throw new Error('Product Not Found');
  }

  produc.producQuantity = newQuantity;

  // Simpan perubahan pada produk
  await produc.save();

  return produc;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteProduc(id) {
  const produc = await ecomerRepository.getProduc(id);

  // User not found
  if (!produc) {
    return null;
  }

  try {
    await ecomerRepository.deleteProduc(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getProducs,
  getProduc,
  createProduc,
  adminLogin,
  nameIsRegistered,
  modifyQuantity,
  adminPassword,
  deleteProduc,
}