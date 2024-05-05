const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { FAILED_LOGIN_LIMIT } = require('./authentication-repository');

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const currentTime = new Date().getTime();
  const lockedInfo = authenticationRepository.isLoginLocked(email, currentTime);
  
  if (lockedInfo.locked) {
    const remainingAttempts = FAILED_LOGIN_LIMIT - authenticationRepository.getFailedLoginAttempts(email);
    const remainingTime = Math.ceil((authenticationRepository.LOGIN_LOCK_DURATION - lockedInfo.elapsedTime) / 60000); // konversi milidetik ke menit

    const errorMessage = `Too many failed login attempts. Please try again later. Remaining attempts: ${remainingAttempts}, Remaining time: ${remainingTime} minutes.`;
    console.log(`[${new Date().toISOString()}] User ${email} mencoba login, namun mendapat error 403 karena telah melebihi limit attempt. Sisa upaya login: ${remainingAttempts}, Sisa waktu: ${remainingTime} menit.`);

    return response.status(403).json({ error: errorMessage });
  }

  const user = await authenticationRepository.getUserByEmail(email);

  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  if (user && passwordChecked) {
      authenticationRepository.resetFailedLoginAttempts(email);
      console.log(`[${new Date().toISOString()}] User ${email} berhasil login.`);
      return { success: true, user: {
          email: user.email,
          name: user.name,
          user_id: user.id,
          token: generateToken(user.email, user.id),
      }};
  } else {
      const failedAttempts = authenticationRepository.recordFailedLoginAttempt(email, currentTime);
      console.log(`[${new Date().toISOString()}] User ${email} gagal login. Attempt = ${failedAttempts}.`);
      
      if (failedAttempts >= FAILED_LOGIN_LIMIT) {
          console.log(`[${new Date().toISOString()}] User ${email} telah mencapai batas maksimum upaya login yang gagal.`);
          return { success: false, error: 'LOCKED' };
      }
      
      return { success: false, error: 'INVALID' };
  }
}

module.exports = {
  checkLoginCredentials,
};
