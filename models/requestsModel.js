const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Name is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Request", requestSchema);
