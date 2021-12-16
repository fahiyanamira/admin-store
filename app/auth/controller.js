const Player = require("../player/model");
//import path (built in dari nodejs)
// const path = require("path");
//import fs
// const fs = require("fs");
//import config:
const config = require("../../config");
//import jsonwebtoken:
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");

module.exports = {
  signup: async (req, res, next) => {
    try {
      const payload = req.body;
      const result = await cloudinary.uploader.upload(req.file.path);

      //kondisi kalau file ada:
      if (result) {
        //buat instance:
        const player = new Player({ ...payload, avatar: result.url, cloudinaryID: result.public_id });

        //di save
        await player.save();

        //delete passwordnya:
        //mongoose harus masuk ke doc nya baru hapus field pass nya
        delete player._doc.password;

        //kasih respon
        res.status(201).json({ data: player });
      } else {
        //kalau gaada:
        let player = new Player(payload);
        await player.save();

        //delete passwordnya:
        //mongoose harus masuk ke doc nya baru hapus field pass nya
        delete player._doc.password;

        //kirim respon:
        res.status(201).json({
          data: player,
        });
      }
    } catch (err) {
      if (err && err.name === "ValidationError") {
        return res.status(422).json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    }
  },

  signin: (req, res, next) => {
    const { email, password } = req.body;

    //cek email ada atau ngga:
    Player.findOne({ email: email })
      .then((player) => {
        //kalau player ada:
        if (player) {
          //cek passwordnya:
          const checkPassword = bcrypt.compareSync(password, player.password);
          if (checkPassword) {
            //nanti simpen tokennya
            const token = jwt.sign(
              {
                player: {
                  id: player.id,
                  username: player.username,
                  email: player.email,
                  name: player.name,
                  phoneNumber: player.phoneNumber,
                  avatar: player.avatar,
                },
              },
              config.jwtKey
            ); //panggil config

            //masukin token ke respon:
            res.status(200).json({
              data: { token },
            });
          } else {
            res.status(403).json({
              message: "password yang anda masukan salah.",
            });
          }
        } else {
          res.status(403).json({
            message: "email belum terdafatar.",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message || `Internal server error`,
        });
        next();
      });
  },
};
