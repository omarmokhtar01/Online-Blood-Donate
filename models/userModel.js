const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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
    email: {
      type: String,
      uniqe: true,
      required: [true, "email is required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "too short password"],
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpire: Date,
    passwordResetVerify: Boolean,
    role: {
      type: String,
      enum: ["user", "admin", "hospitalAdmin"],
      default: "user",
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    nationalID: {
      type: String,
      required: [true, "nationalID is required"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
      lowercase: true,
    },
    birthDate: { type: Date, required: [true, "birthDate is required"] },
    bloodType: {
      type: String,
      required: [true, "bloodType is required"],
      enum: ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
    },
    donateAt: Date,
    countDonate: { type: Number, default: 0 },
    // bloodType [String]
    // city String
    // donateAt Date
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
