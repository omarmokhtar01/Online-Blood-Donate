const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/createToken");
const handler = require("./handlerFactory");

// @desc Get User Profile
// @route Get /api/v1/user/myProfile
// @access Private/Protect
exports.getProfile = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc Update specific User Data
// @route Put /api/v1/user/myProfile
// @access Private(user)
exports.updateUserData = asyncHandler(async (req, res, next) => {
  const { name, email, phone, nationalID } = req.body;
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      phone,
      nationalID,
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(404, `user is not found ${user._id}`));
  }
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.specificUser = handler.getSpecificOne(userModel, "User");
