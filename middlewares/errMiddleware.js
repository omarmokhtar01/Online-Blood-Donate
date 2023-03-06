const ApiError = require("../utils/apiError");
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "development") {
    sendErrorForDev(err, res);
  } else {
    sendErrorForPro(err, res);
  }
};

const errForTokenProduction = () =>
  new ApiError(401, "Invalid token, please login");
const expireTokenProduction = () =>
  new ApiError(401, "Invalid time token, please login again");

// Error in production mode
const sendErrorForPro = (err, res) => {
  if (err.name === "JsonWebTokenError") err = errForTokenProduction();
  if (err.name === "TokenExpiredError") err = expireTokenProduction();

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

// Error in development mode
const sendErrorForDev = (err, res) => {
  if (err.name === "JsonWebTokenError") err = errForTokenProduction();
  if (err.name === "TokenExpiredError") err = expireTokenProduction();

  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack, // location of error
  });
};

module.exports = globalError;
