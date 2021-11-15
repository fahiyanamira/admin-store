//import mongoose nya:
const mongoose = require("mongoose");

let categorySchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Nama category wajib diisi."],
  },
});

//export
module.exports = mongoose.model("Category", categorySchema);
