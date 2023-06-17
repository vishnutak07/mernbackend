const mongoose = require("mongoose");
const URI = "mongodb://localhost:27017/notes";

const connectToMongo = async () => {
  mongoose
    .connect(URI)
    .then(() => {
      console.log("ho gya");
    })
    .catch(() => {
      console.log("nai ho paya");
    });
};

module.exports = connectToMongo;
