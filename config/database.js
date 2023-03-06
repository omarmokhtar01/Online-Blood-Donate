const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/BloodDonate").then(
    (conn) => {
      console.log(`DB is Connection BloodDonate`);
    },
    {
      useNewUrlParser: true,
    }
  );
};

module.exports = dbConnection;
