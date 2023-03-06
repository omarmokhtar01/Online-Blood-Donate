const express = require("express");
const { ruleUpdateUserLoggerValidator } = require("../utils/validator/users");

const {
  specificUser,
  getProfile,

  updateUserData,
} = require("../Controller/userServices");

const { authProtect, allowedTo } = require("../Controller/authService");

const router = express.Router();

// User
router.use(authProtect, allowedTo("user"));
router
  .route("/myProfile")
  .get(getProfile, specificUser)
  .put(ruleUpdateUserLoggerValidator, updateUserData);

module.exports = router;
