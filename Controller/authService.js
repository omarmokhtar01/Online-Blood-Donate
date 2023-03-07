const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const generateToken = require("../utils/createToken");
const sendEmail = require("../utils/sendEmail");
const {
  sanitizeUserLogin,
  sanitizeUserSignup,
} = require("../utils/sanitizeData");

// @desc create new user
// @route Post /api/v1/auth/signup
// access Public
exports.signup = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    nationalID,
    bloodType,
    birthDate,
    city,
  } = req.body;
  const user = await userModel.create({
    name,
    email,
    password,
    phone,
    nationalID,
    bloodType,
    birthDate,
    city,
  });
  // Generate Token
  const token = generateToken(user._id);
  // Generate Cookie
  res.status(201).json({ data: sanitizeUserSignup(user), token });
});

// @desc login
// @route Post /api/v1/auth/login
// access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError(401, "Incorrect email or password"));
  }
  const token = generateToken(user._id);
  res.status(200).json({ data: sanitizeUserLogin(user), token });
});

// @desc check about token verify & login
exports.authProtect = asyncHandler(async (req, res, next) => {
  // 1) Check if get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(token);
  }
  if (!token) {
    new ApiError(401, "Please Login first to access this route");
  }
  // 2) verify token (no changes , expired)
  const decode = jwt.verify(token, process.env.PRIVATEKEY);
  // 3) if user existis
  const currentUser = await userModel.findById(decode.userID);
  if (!currentUser) {
    new ApiError(401, " user for this token is not existis");
  }
  // 4) check is user is change password after token is created
  if (currentUser.passwordChangeAt) {
    // decode.iat: is time make token (time stamp)
    let passChangeTimeStamp = parseInt(
      currentUser.passwordChangeAt.getTime() / 1000,
      10 /*Base 10*/
    );
    // password is changed
    if (passChangeTimeStamp > decode.iat) {
      next(new ApiError(401, "user is change password, please login again"));
    }
  }
  // to can access user in future
  req.user = currentUser;
  next();
});

// @desc to check how can access to specific routes
// @desc    Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc forgotPassword
// @route Post /api/v1/auth/forgotpassword
// access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  // 1) get user by email
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ApiError(404, `this email is not exsist ${email}`));
  }
  // 2) set random 6 numbers hashed and save to DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // to encrypt reset code
  const hashResetCode = crypto
    .createHash("md5")
    .update(resetCode)
    .digest("hex");
  user.passwordResetCode = hashResetCode;
  // time code to reset password 10 min
  user.passwordResetExpire = Date.now() + 1 * 60 * 1000; // 1 Mini
  // to check if reset is not verify
  user.passwordResetVerify = false;
  await user.save();
  // 3) send the code to email

  let message = `Hi ${user.name}, \n
    There was a request to change your password!\n
    If you did not make this request then please ignore this email. \n
    Otherwise, this is reset code to change your password: ${resetCode}`;
  try {
    await sendEmail({ email: user, subject: "Your reset password", message });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpire = undefined;
    user.passwordResetVerify = undefined;
    await user.save();
    return new ApiError(500, "Error sending email");
  }

  res.status(200).json({ message: "message is sended" });
});

exports.verifyResetCodePassword = asyncHandler(async (req, res, next) => {
  const hashResetCode = crypto
    .createHash("md5")
    .update(req.body.passwordResetCode)
    .digest("hex");
  const user = await userModel.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError(400, "Invalid resetCode"));
  }

  user.passwordResetVerify = true;
  await user.save();
  res.status(200).json({ message: "Success Code" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ApiError(404, `user is not found: ${user}`));
  }
  if (!user.passwordResetVerify) {
    return next(new ApiError(400, `Reset code is not Verify`));
  }
  if (Date.now() > user.passwordResetExpire) {
    user.passwordResetCode = undefined;
    user.passwordResetExpire = undefined;
    user.passwordResetVerify = undefined;
    await user.save();
    return next(new ApiError(400, `Reset code is time out,Please try again`));
  }
  user.password = newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpire = undefined;
  user.passwordResetVerify = undefined;
  await user.save();
  const token = generateToken(user._id);
  res.status(200).json({ token: token });
});

// @desc Update User Password
// @route Put /api/v1/auth/changePassword
// @access Private/Protect(user)
exports.updatePasswordUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangeAt: Date.now(),
    },
    { new: true }
  );
  console.log(user);

  if (!user) {
    return next(new ApiError(404, `user is not found ${user._id}`));
  }
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});
