const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const userModel = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.ruleUpdateData = [
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
  // Check phone
  check("phone")
    .notEmpty()
    .withMessage("phone is Required")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter egyptian number"),
  // Check nationalID
  check("nationalID")
    .notEmpty()
    .withMessage("National ID is Required")
    .isString()
    .isLength({ min: 14, max: 14 })
    .withMessage("Please enter valid national ID"),
  validatorMiddleware,
];

exports.ruleGetUserProfile = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  validatorMiddleware,
];
