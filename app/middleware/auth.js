module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash("alertMessage", `Maaf session anda telah habis. Silahkan Login kembali`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    } else {
      next();
    }
  },
};
