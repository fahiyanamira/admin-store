const Player = require("../player/model");
//import path (built in dari nodejs)
const path = require("path");
//import fs
const fs = require("fs");
//import config:
const config = require("../../config");
//import jsonwebtoken:
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  signup: async (req, res, next) => {
    try {
      const payload = req.body;

      if (req.file) {
        let tmp_path = req.file.path;
        let originaExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
        let filename = req.file.filename + "." + originaExt;
        let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const player = new Player({ ...payload, avatar: filename });

            await player.save();

            delete player._doc.password;

            res.status(201).json({ data: player });
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
        });
      } else {
        let player = new Player(payload);

        await player.save();

        delete player._doc.password;

        res.status(201).json({ data: player });
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
  // signin: async (req, res, next) => {
  //   try {
  //     const { email, password } = req.body;
  //     const player = await Player.findOne({ email: email });

  //     if (player) {
  //       const checkPass = bcrypt.compareSync(password, player.password);
  //       if (checkPass) {
  //         const token = jwt.sign(
  //           {
  //             player: {
  //               id: player._id,
  //               username: player.username,
  //               email: player.email,
  //               name: player.name,
  //               phoneNumber: player.phoneNumber,
  //               avatar: player.avatar,
  //             },
  //           },
  //           config.jwtKey
  //         );

  //         res.status(200).json({ data: { token } });
  //       } else {
  //         res.status(403).json({ message: "password yang anda masukan salah" });
  //       }
  //     } else {
  //       res.status(403).json({ message: "email belum terdafatar." });
  //     }
  //   } catch (err) {
  //     res.status(500).json({ message: err.message || `Internal server error` });
  //     next();
  //   }
  // },
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
                  nama: player.nama,
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
