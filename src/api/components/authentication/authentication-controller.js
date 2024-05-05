const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginResult = await authenticationServices.checkLoginCredentials(email, password);

    if (!loginResult.success) {
      const errorMessage = loginResult.error === 'LOCKED' ? 'Too many failed login attempts. Please try again later.' : 'Wrong email or password';
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, errorMessage);
    }

    return response.status(200).json(loginResult.user);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
