const JWT = require("jsonwebtoken");

const getSecret = () => process.env.JWT_SECRET || "supersecretkey_change_this_in_production";
const getExpiresIn = () => process.env.JWT_EXPIRES_IN || "7d";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  return JWT.sign(payload, getSecret(), { expiresIn: getExpiresIn() });
}

function validateToken(token) {
  return JWT.verify(token, getSecret());
}

module.exports = {
  createTokenForUser,
  validateToken,
};