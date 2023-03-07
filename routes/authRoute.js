const express = require("express");
const {
  ruleSignUpValidator,
  ruleLoginValidator,
  rulePasswordUserValidator,
  ruleForgotPassword,
  ruleVerifyResetCodePassword,
  ruleResetPassword,
} = require("../utils/validator/authValidate");

const {
  signup,
  login,
  forgotPassword,
  verifyResetCodePassword,
  resetPassword,
  updatePasswordUser,
  allowedTo,
  authProtect,
} = require("../Controller/authService");

const router = express.Router();

router.route("/signup").post(ruleSignUpValidator, signup);

router.route("/login").post(ruleLoginValidator, login);

router.post("/forgotpassword", ruleForgotPassword, forgotPassword);
router.post(
  "/verify-reset-code",
  ruleVerifyResetCodePassword,
  verifyResetCodePassword
);
router.post("/resetPassword", ruleResetPassword, resetPassword);
router
  .route("/changePassword")
  .put(
    authProtect,
    allowedTo("user"),
    rulePasswordUserValidator,
    updatePasswordUser
  );
module.exports = router;
