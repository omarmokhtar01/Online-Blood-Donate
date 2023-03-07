const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.ruleGetOneResult = [
  check("id").isMongoId().withMessage("Invalid Request Id"),
  validatorMiddleware,
];
