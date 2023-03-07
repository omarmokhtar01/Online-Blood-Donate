const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.ruleGetOneHospital = [
  check("id").isMongoId().withMessage("Invalid Hospital Id"),
  validatorMiddleware,
];
