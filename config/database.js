const mongoose = require("mongoose");

const dataBaseConnection = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Mongo DB connection established");
    })
    .catch((error) => console.log(error));
};

module.exports = dataBaseConnection;
