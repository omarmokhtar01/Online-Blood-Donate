const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },

    address: {
      type: String,
      required: [true, "address is required"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
