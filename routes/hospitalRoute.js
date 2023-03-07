const express = require("express");
const { ruleGetOneHospital } = require("../utils/validator/hospital");

const {
  getAllHospitals,
  getOneHospital,
} = require("../Controller/hospitalServices");

const router = express.Router();

router.get("/", getAllHospitals);
router.get("/:id", ruleGetOneHospital, getOneHospital);

module.exports = router;
