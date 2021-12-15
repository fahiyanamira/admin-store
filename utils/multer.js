const multer = require("multer");
const path = require("path");

//config multer:
module.exports = multer({
  storage: multer.diskStorage({}),

  //filter file yg dipengenin:
  fileFilter: (req, file, cb) => {
    //ekstrak extension file:
    let ext = path.extname(file.originalname);

    //ekstensi file yg bisa:
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("tipe file tidak bisa diterima."), false);
      return;
    }
    cb(null, true);
  },
});
