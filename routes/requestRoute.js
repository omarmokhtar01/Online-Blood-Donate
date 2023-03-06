const express = require("express");
// const { ruleUpdateUserLoggerValidator } = require("../utils/validator/users");

const {
  createReservationDonateRequest,
} = require("../Controller/requestServices");
const { authProtect, allowedTo } = require("../Controller/authService");

const router = express.Router();

router.post(
  "/",
  authProtect,
  allowedTo("user"),
  createReservationDonateRequest
);

module.exports = router;
