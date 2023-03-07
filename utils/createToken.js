const jwt = require("jsonwebtoken");
// payLoad is a data in token
const generateToken = (payLoad) => {
  return jwt.sign({ userID: payLoad }, process.env.PRIVATEKEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = generateToken;
