const { User } = require('../../../models');
let failedLoginAttempts = {};
const FAILED_LOGIN_LIMIT = 5; // Tentukan batas maksimum upaya login yang gagal di sini
const LOGIN_LOCK_DURATION = 30 * 60 * 1000; // 30 menit dalam milidetik

// Fungsi untuk menyimpan waktu terakhir upaya login yang gagal
function recordFailedLoginAttempt(email, timestamp) {
    if (!failedLoginAttempts[email]) {
        failedLoginAttempts[email] = { attempts: 1, lastAttempt: timestamp };
    } else {
        failedLoginAttempts[email].attempts++;
        failedLoginAttempts[email].lastAttempt = timestamp;
    }
    return failedLoginAttempts[email].attempts; // Mengembalikan jumlah upaya login yang gagal
}

// Fungsi untuk mendapatkan jumlah upaya login yang gagal
function getFailedLoginAttempts(email) {
    return failedLoginAttempts[email] ? failedLoginAttempts[email].attempts : 0;
}

// Fungsi untuk memeriksa apakah limit upaya login yang gagal telah tercapai
function isLoginLocked(email, timestamp) {
    if (failedLoginAttempts[email] && failedLoginAttempts[email].attempts >= FAILED_LOGIN_LIMIT) {
        const lastAttemptTime = failedLoginAttempts[email].lastAttempt;
        const elapsedTime = timestamp - lastAttemptTime;
        return { locked: elapsedTime < LOGIN_LOCK_DURATION, elapsedTime };
    }
    return { locked: false, elapsedTime: 0 };
}

// Fungsi untuk mengatur ulang upaya login yang gagal setelah berhasil login
function resetFailedLoginAttempts(email) {
    if (failedLoginAttempts[email]) {
        delete failedLoginAttempts[email];
    }
}

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

module.exports = {
  getUserByEmail,
  resetFailedLoginAttempts,
  isLoginLocked,
  recordFailedLoginAttempt,
  getFailedLoginAttempts,
  FAILED_LOGIN_LIMIT,
  LOGIN_LOCK_DURATION,
};
