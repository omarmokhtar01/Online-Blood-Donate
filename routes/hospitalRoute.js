const express = require("express");
// const { ruleUpdateUserLoggerValidator } = require("../utils/validator/users");

const {
  getAllHospitals,
  getOneHospital,
} = require("../Controller/hospitalServices");

const router = express.Router();

router.get("/", getAllHospitals);
router.get("/:id", getOneHospital);

module.exports = router;
