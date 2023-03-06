const dotenv = require("dotenv");
dotenv.config({ path: "../../config.env" });
const fs = require("fs");
const colors = require("colors");
const hospitaltModel = require("../../models/hospitalModel");
const dbConnection = require("../../config/database");

// DataBase Connection
dbConnection();

// Read Data
const productData = JSON.parse(fs.readFileSync("./products.json"));

// Insert Data
const insertData = async () => {
  try {
    await hospitaltModel.create(productData);
    console.log("Data is Inserted".green);
    // eslint-disable-next-line no-process-exit
    process.exit();
  } catch (erorr) {
    console.log(erorr);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await hospitaltModel.deleteMany();
    console.log("Data is Deleted".red);
    // eslint-disable-next-line no-process-exit
    process.exit();
  } catch (erorr) {
    console.log(erorr);
  }
};

// process.argv[2] == '-i'  node seeder.js -i
if (process.argv[2] == "-i") {
  insertData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
