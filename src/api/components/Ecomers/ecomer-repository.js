const { Product } = require('../../../models')
const { User } = require('../../../models')


/**
 * Get a list of product
 * @returns {Promise}
 */
async function getProducs(){
  return Product.find({});
}

/**
 * Get produc detail
 * @param {string} id - product id
 * @returns {Promise}
 */
async function getProduc(id) {
  return Product.findById(id);
}

/**
 * Create new product
 * @param {string} producName - produc name
 * @param {Number} producQuantity - how many product on warehouse
 * @param {Number} productPrice - price of product
 * @param {string} productDesc - product description
 * @returns {Promise}
 */
async function createProduc(producName, producQuantity, producPrice, producDesc) {
  return Product.create({
    producName,
    producQuantity,
    producPrice,
    producDesc,
  });
}

/**
 * Delete a user
 * @param {string} id 
 * @returns {Promise}
 */
async function deleteProduc(id) {
  return Product.deleteOne({ _id: id });
}

async function findAdmin (email){
  return User.findOne({email});
}

async function selecProduct (producName){
  return Product.findOne({producName});
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} producName - nama barang
 * @returns {Promise}
 */
async function getProducByName(producName) {
  return Product.findOne({ producName });
}


module.exports = {
  getProduc,
  getProducs,
  createProduc,
  findAdmin,
  selecProduct,
  getProducByName,
  deleteProduc
}