const mongoose = require("mongoose");
require('dotenv').config()
const URI = process.env.DATABASE;

const connectToMongo = async () => {
  mongoose
    .connect(URI,{
      // useNewUrlParser: true,
      // useUnifiedTopology:true,
    })
    .then(() => {
      console.log("ho gya");
    })
    .catch(() => {
      console.log("nai ho paya");
    });
};

module.exports = connectToMongo;
