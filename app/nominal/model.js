//import mongoose nya:
const mongoose = require("mongoose");

let nominalSchema = mongoose.Schema({
  coinQty: {
    type: Number,
    default: 0,
  },
  coinName: {
    type: String,
    require: [true, "Nama nominal wajib diisi"],
  },
  price: {
    type: Number,
    default: 0,
  },
});

//export
module.exports = mongoose.model("Nominal", nominalSchema);
