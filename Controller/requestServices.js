const requestsModel = require("../models/requestsModel");
const userModel = require("../models/userModel");

const handler = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");
const ApiError = require("../utils/apiError");

// @desc Create Reservation to Donate
// @route Post /api/v1/donate
// @access Protected(user)
exports.createReservationDonateRequest = asyncHandler(
  async (req, res, next) => {
    const user = await userModel.findOne(req.user._id);
    const { hospitalName, donateHistory, donateTime, bloodType } = req.body;
    const donate = await requestsModel.create({
      userId: req.user._id,
      hospitalName,
      donateHistory,
      donateTime,
      bloodType,
    });
    let message = `Hi I'm ${user.name}, \n
    I want to make an appointment at ${hospitalName} Hospital to donate blood\n
    on the date:${donateHistory}\n
    the hour:${donateTime}\n
    blood type:${bloodType}\n\n
    
    User Information:\n
    email:${user.email}\n
    phone:${user.phone}\n
    National ID${user.nationalID}:

    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Blood Donate",
        message,
      });
    } catch (err) {
      return new ApiError(500, "Error sending email");
    }
    res.status(200).json({ data: donate });
  }
);

// @desc Get Result Donate
// @route Post /api/v1/donate/:id
// @access Protected(user)
exports.getResultDonate = asyncHandler(async (req, res, next) => {
  const donate = await requestsModel.findById(req.params.id);

  if (!donate.requestResult) {
    return next(new ApiError(404, "You do not have a result"));
  }
  // const user = await userModel.findOneAndUpdate(req.user._id, {
  //   $inc: { countDonate: 1 },
  // });
  res.status(200).json({ data: donate });
});

// @desc Get All Result Donate
// @route Post /api/v1/donate/allResults
// @access Protected(user)
exports.getAllResultDonate = asyncHandler(async (req, res, next) => {
  const donate = await requestsModel.find({ userId: req.user._id });
  console.log(donate);

  if (!donate) {
    return next(new ApiError(404, "You do not have a result"));
  }
  // const user = await userModel.findOneAndUpdate(req.user._id, {
  //   $inc: { countDonate: 1 },
  // });
  res.status(200).json({ countDonate: donate.length, data: donate });
});
