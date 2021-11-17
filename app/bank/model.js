//import mongoose nya:
const mongoose = require("mongoose");

let bankSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Nama pemilik bank wajib diisi"],
  },
  nameBank: {
    type: String,
    require: [true, "Nama bank wajib diisi"],
  },
  noRekening: {
    type: String,
    require: [true, "Nomer rekening bank wajib diisi"],
  },
});

//export
module.exports = mongoose.model("Bank", bankSchema);
