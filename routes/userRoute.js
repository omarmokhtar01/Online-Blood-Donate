const express = require("express");
const {
  ruleUpdateData,
  ruleGetUserProfile,
} = require("../utils/validator/users");

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
  .get(ruleGetUserProfile, getProfile, specificUser)
  .put(ruleUpdateData, updateUserData);

module.exports = router;
