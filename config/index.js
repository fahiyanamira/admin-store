//imprt env:
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

//export:
module.exports = {
  //buat rootpath:
  rootPath: path.resolve(__dirname, ".."),
  // panggil env
  serviceName: process.env.SERVICE_NAME,
  //DEKLARASI JWTKEY
  jwtKey: process.env.SECRET,
  urlDB: process.env.MONGO_URL_PROD,
};
