//import mongoose nya:
const mongoose = require("mongoose");

let transactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: { type: String, require: [true, "Nama game wajib diisi"] },
      category: { type: String, require: [true, "Category wajib diisi"] },
      thumbnail: { type: String },
      coinName: { type: String, require: [true, "Nama coin wajib diisi"] },
      coinQuantity: { type: String, require: [true, "Jumlah coin wajib diisi"] },
      price: { type: Number },
    },
    historyPayment: {
      name: { type: String, require: [true, "Nama wajib diisi"] },
      type: { type: String, require: [true, "Tipe pembayaran wajib diisi"] },
      bankName: { type: String, require: [true, "Nama bank wajib diisi"] },
      noRekening: { type: Number, require: [true, "Nomor rekening wajib diisi"] },
    },
    name: {
      type: String,
      require: [true, "Nama wajib diisi"],
      minlength: [3, "Panjang nama harus di antara 3 - 225 karakter"],
      maxlength: [225, "Panjang nama harus di antara 3 - 225 karakter"],
    },
    accountUser: {
      type: String,
      require: [true, "Nama akun wajib diisi"],
      minlength: [3, "Panjang nama harus di antara 3 - 225 karakter"],
      maxlength: [225, "Panjang nama harus di antara 3 - 225 karakter"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    historyUser: {
      name: { type: String, require: [true, "Nama player wajib diisi"] },
      phoneNumber: {
        type: Number,
        require: [true, "Nomor telephon wajib diisi"],
        minlength: [9, "Panjang nama harus di antara 9 - 13 digit"],
        maxlength: [13, "Panjang nama harus di antara 9 - 13 digit"],
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//export
module.exports = mongoose.model("Transaction", transactionSchema);
