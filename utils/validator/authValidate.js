const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const userModel = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
var bcrypt = require("bcryptjs");

exports.ruleSignUpValidator = [
  // Check Name
  check("name")
    .notEmpty()
    .withMessage("Should Not Empty")
    .isString()
    .withMessage("Should be String")
    .isLength({ min: 3, max: 32 })
    .withMessage("Invalid Length Name between 3 , 32 charactar"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  // Check Email
  check("email")
    .notEmpty()
    .withMessage("Email Should Not Empty")
    .isEmail()
    .withMessage("Input should be Email")
    .custom((value) => {
      return userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  // Check Password
  check("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6 }),
  body("confirmedPassword")
    .exists({ checkFalsy: true })
    .withMessage("You must type a confirmation password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The passwords do not match"),
  check("phone")
    .notEmpty()
    .withMessage("phone is Required")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter egyptian number"),
  check("nationalID")
    .notEmpty()
    .withMessage("National ID is Required")
    .isString()
    .isLength({ min: 14, max: 14 })
    .withMessage("Please enter valid national ID"),

  validatorMiddleware,
];

exports.ruleLoginValidator = [
  // Check Email
  check("email")
    .notEmpty()
    .withMessage("Email Should Not Empty")
    .isEmail()
    .withMessage("Input should be Email"),
  // Check Password
  check("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6 }),
  validatorMiddleware,
];

exports.rulePasswordUserValidator = [
  check("oldPassword").notEmpty().withMessage("oldPassword is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required"),
  check("password")
    .notEmpty()
    .withMessage("new Password is required")
    .custom(async (val, { req }) => {
      console.log(req.user);
      const user = await userModel.findById(req.user._id);
      if (!user) {
        throw new Error(`User Not Found`);
      }
      const checkOldPass = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (!checkOldPass) {
        throw new Error("Old Password is Incorrect");
      }
      if (req.body.oldPassword === req.body.password) {
        throw new Error("Incorrect new Password");
      }
      if (val !== req.body.confirmPassword) {
        throw new Error("The confirmPassword do not match password");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.ruleForgotPassword = [
  check("email")
    .notEmpty()
    .withMessage("Email Should Not Empty")
    .isEmail()
    .withMessage("Input should be Email")
    .custom((val) => {
      return userModel.findOne({ email: val }).then((user) => {
        if (!user) {
          return Promise.reject("Invalid Email");
        }
      });
    }),
  validatorMiddleware,
];

exports.ruleVerifyResetCodePassword = [
  check("passwordResetCode")
    .notEmpty()
    .withMessage("passwordResetCode is required")
    .isString()
    .withMessage("passwordResetCode should be String"),
  validatorMiddleware,
];

exports.ruleResetPassword = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please Enter Email")
    .custom((val) => {
      return userModel.findOne({ email: val }).then((user) => {
        if (!user) {
          return Promise.reject("Invalid Email or newPassword");
        }
      });
    }),

  check("newPassword")
    .notEmpty()
    .withMessage("newPassword field is required")
    .isString()
    .withMessage("newPassword should be String"),
  validatorMiddleware,
];
