//import mongoose nya:
const mongoose = require("mongoose");

let voucherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama game wajib diisi"],
    },
    status: {
      type: String,
      enum: ["Y", "N"], //enum punya 2 nilai. Y=active, N=tidak active
      default: "Y",
    },
    thumbnail: {
      //thumbnail buat imagenya
      type: String,
    },
    category: {
      //nanti direlasikan sama model category
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    nominals: [
      {
        //nanti direlasikan sama model nominal
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nominal",
      },
    ],
    user: {
      //nanti direlasikan sama model user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//export
module.exports = mongoose.model("Voucher", voucherSchema);
