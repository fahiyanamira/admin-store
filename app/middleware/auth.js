const config = require("../../config");
const jwt = require("jsonwebtoken");
const Player = require("../player/model");

module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash("alertMessage", `Mohon maaf session anda telah habis silahkan login kembali`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    } else {
      next();
    }
  },

  isLoginPlayer: async (req, res, next) => {
    try {
      //cek token kalau ada nanti di ganti bearernay:
      const token = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null;
      //cek token ada di db:
      const data = jwt.verify(token, config.jwtKey);
      //kondisi kalau playernya gaada:
      const player = await Player.findOne({ _id: data.player.id });

      if (!player) {
        throw new Error();
      }

      req.player = player;
      req.token = token;
      next();
    } catch (err) {
      res.status(401).json({
        error: "Not authorized to acces this resource",
      });
    }
  },
};
