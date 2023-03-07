const express = require("express");
const { ruleGetOneResult } = require("../utils/validator/requests");

const {
  createReservationDonateRequest,
  getResultDonate,
  getAllResultDonate,
} = require("../Controller/requestServices");
const { authProtect, allowedTo } = require("../Controller/authService");

const router = express.Router();
router.use(authProtect, allowedTo("user"));
router.post("/", createReservationDonateRequest);
router.get("/allResults", getAllResultDonate);

router.get("/:id", ruleGetOneResult, getResultDonate);
module.exports = router;
