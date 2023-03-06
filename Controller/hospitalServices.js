const hospitalModel = require("../models/hospitalModel");
const handler = require("./handlerFactory");

// @desc Get All Hospitals
// @route Get /api/v1/hospital
// @access Public
exports.getAllHospitals = handler.getAll(hospitalModel, "Hospital");

// @desc Get One Hospital
// @route Put /api/v1/hospital/:id
// @access Public
exports.getOneHospital = handler.getSpecificOne(hospitalModel);
