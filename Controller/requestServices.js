const requestsModel = require("../models/requestsModel");
const userModel = require("../models/userModel");

const handler = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");

// @desc Get All Hospitals
// @route Get /api/v1/hospital
// @access Public
exports.createReservationDonateRequest = asyncHandler(
  async (req, res, next) => {
    const user = await userModel.findOne(req.user._id);
    console.log(user.password);
    const donate = await requestsModel.create({
      userId: req.user._id,

      // hospital name
      // city
      // userId
      donateHistory: req.body.donateHistory,
      // date
      // hour at
      donateTime: req.body.donateTime,

      // bloodType
      bloodType: req.body.bloodType,
      // [resultDonate]
    });
    user.donateAt = req.body.donateHistory;
    user.countDonate += 1;
    await user.save();
    console.log(user.password);
    res.status(200).json({ data: donate });
  }
);

// @desc Get One Hospital
// @route Put /api/v1/hospital/:id
// @access Public
// exports.getOneHospital = handler.getSpecificOne(hospitalModel);
