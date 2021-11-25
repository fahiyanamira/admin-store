//import mongoose:
const mongoose = require("mongoose");

//panggil urlDB:
const { urlDB } = require("../config");
mongoose.connect(urlDB, {
  // useCreateIndex: true,
  // useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

//export dbnya:
module.exports = db;
