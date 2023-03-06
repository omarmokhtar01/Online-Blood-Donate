const express = require("express");
const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const hospitalRoute = require("./hospitalRoute");
const donateRequest = require("./requestRoute");

const mountRoute = (app) => {
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/hospital", hospitalRoute);
  app.use("/api/v1/donate", donateRequest);
};

module.exports = mountRoute;
