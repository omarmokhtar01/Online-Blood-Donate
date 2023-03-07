const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Name is required"],
    },
    hospitalName: {
      type: String,
      required: [true, "hospitalName is required"],
    },
    donateHistory: {
      type: Date,
      required: [true, "donateHistory is required"],
    },
    donateTime: { type: Number, required: [true, "donateTime is required"] },
    bloodType: {
      type: String,
      enum: ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
      required: [true, "bloodType is required"],
    },
    requestResult: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", requestSchema);
