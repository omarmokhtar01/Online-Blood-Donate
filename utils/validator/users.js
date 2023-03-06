const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const userModel = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
var bcrypt = require("bcryptjs");

exports.ruleCreateUserValidator = [
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
  // Check role
  check("role").default("user"),
  // Check phone
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Phone Number should egypt or saudi"),
  // Check profileImg
  check("profileImg").optional(),
  // Check active
  check("active").optional().isBoolean().default("true"),
  validatorMiddleware,
];

exports.ruleGetUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  validatorMiddleware,
];

exports.ruleUpdateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  body("name")
    .optional()
    .custom((val, { req }) => {
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
  check("role").default("user"),
  // Check phone
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Phone Number should egypt or saudi"),
  // Check profileImg
  check("profileImg").optional(),
  // Check active
  check("active").optional().isBoolean().default("true"),

  validatorMiddleware,
];

exports.ruleUpdateUserLoggerValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
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
  // Check phone
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Phone Number should egypt or saudi"),
  // Check profileImg
  check("profileImg").optional(),
  validatorMiddleware,
];

exports.rulePasswordAdminValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  check("oldPassword").notEmpty().withMessage("oldPassword is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required"),
  check("password")
    .notEmpty()
    .withMessage("new Password is required")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error(`No user have by this id ${req.params.id}`);
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

exports.rulePasswordUserValidator = [
  check("oldPassword").notEmpty().withMessage("oldPassword is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required"),
  check("password")
    .notEmpty()
    .withMessage("new Password is required")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.user._id);
      if (!user) {
        throw new Error(`No user have by this id ${req.user._id}`);
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

exports.ruleDeleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  validatorMiddleware,
];
