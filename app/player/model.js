//import mongoose nya:
const mongoose = require("mongoose");

let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "email harus diisi"],
    },
    name: {
      type: String,
      require: [true, "nama harus diisi"],
      minlength: [3, "panjang nama harus 3 - 225 karakter"],
      maxlength: [225, "panjang nama harus 3 - 225 karakter"],
    },
    username: {
      type: String,
      require: [true, "nama harus diisi"],
      maxlength: [225, "panjang password maksimal harus 225 karakter"],
    },
    password: {
      type: String,
      require: [true, "kata sandi harus diisi"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    avatar: { type: String },
    fileName: { type: String },
    phoneNumber: {
      type: String,
      require: [true, "nomor telpon harus diisi"],
      minlength: [9, "panjang nomor telepon harus 9 - 13 karakter"],
      maxlength: [13, "panjang nomor telepon harus 9 - 13 karakter"],
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
