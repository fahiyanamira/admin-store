//import mongoose nya:
const mongoose = require("mongoose");

let nominalSchema = mongoose.Schema(
  {
    coinQuantity: {
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
  },
  { timestamps: true }
);

//export
module.exports = mongoose.model("Nominal", nominalSchema);
