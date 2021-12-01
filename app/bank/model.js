//import mongoose nya:
const mongoose = require("mongoose");


let bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama pengguna wajib diisi"],
    },
    bankName: {
      type: String,
      require: [true, "Nama bank wajib diisi"],
    },
    noRekening: {
      type: Number,
      require: [true, "Nomor rekening bank wajib diisi"],
    },
  },
  { timestamps: true }
);


//export
module.exports = mongoose.model("Bank", bankSchema);
