const Player = require("./model");
const Voucher = require("../voucher/model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const Payment = require("../payment/model");
const Bank = require("../bank/model");
const Transaction = require("../transaction/model");
//import path (built in dari nodejs)
const path = require("path");
//import fs
const fs = require("fs");
//import config:
const config = require("../../config");
const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find().select("_id name status category thumbnail").populate("category");

      res.status(200).json({ data: voucher });
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findOne({ _id: id }).populate("category").populate("nominals").populate("user", "_id name phoneNumber");
      const payment = await Payment.find().populate("banks");

      //cek apakah vouchernya ada atau tidak:
      if (!voucher) {
        return res.status(404).json({ message: "voucher tidak ditemukan" });
      }

      res.status(200).json({
        data: {
          voucher,
          payment,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` });
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();
      res.status(200).json({ data: category });
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` });
    }
  },
  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;

      //cek voucher berdasarkan id:
      const res_voucher = await Voucher.findOne({ _id: voucher }).select("name category _id thumbnail user").populate("category").populate("user");
      //cek vouchernya kalau gaada:
      if (!res_voucher) return res.status(404).json({ message: "voucher game tidak ada." });

      //cek nominal berdasarkan id:
      const res_nominal = await Nominal.findOne({ _id: nominal });
      //cek nominalnya kalau gaada:
      if (!res_nominal) return res.status(404).json({ message: "nominal tidak ada." });

      //cek payment:
      const res_payment = await Payment.findOne({ _id: payment });
      //cek payment kalau gaada:
      if (!payment) return res.status(404).json({ message: "payment tidak ada" });

      //cek bank:
      const res_bank = await Bank.findOne({ _id: bank });
      //kalau bank gaada:
      if (!res_bank) return res.status(404).json({ message: "bank tidak ada." });

      //rumus tax price nominal x 10%:
      let tax = (10 / 100) * res_nominal._doc.price;
      //harga akhirnya
      let value = res_nominal._doc.price - tax;

      //handle history voucher:
      const payload = {
        historyVoucherTopup: {
          gameName: res_voucher._doc.name,
          //kondisi jika category ada nanti namanya muncul kalau gaada kasih string kosong:
          category: res_voucher._doc.category ? res_voucher._doc.name : "",
          thumbnail: res_voucher._doc.thumbnail,
          coinName: res_nominal._doc.coinName,
          coinQuantity: res_nominal._doc.coinQuantity,
          price: res_nominal._doc.price,
        },
        historyPayment: {
          name: res_bank._doc.name,
          type: res_payment._doc.type,
          bankName: res_bank._doc.bankName,
          noRekening: res_bank._doc.noRekening,
        },
        name,
        accountUser,
        tax,
        value,
        player: req.player._id,
        historyUser: {
          name: res_voucher._doc.user.name,
          phoneNumber: res_voucher._doc.user.phoneNumber,
        },
        category: res_voucher._doc.category._id,
        user: res_voucher._doc.user._id,
      };

      const transaction = new Transaction(payload);
      await transaction.save();

      //tampilin respon jsonnya:
      res.status(201).json({ data: transaction });
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` });
    }
  },
  history: async (req, res) => {
    try {
      //default query kosong.
      const { status = "" } = req.query;

      let criteria = {};
      //cek length status:
      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: "i" },
        };
      }

      //cek id player nanti tampilin sesuai id player:
      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      //history didapetin dari transaksi:
      const history = await Transaction.find(criteria);

      //nampilin total value (harga selama melakukan transaksi) yang ada di match menggunakan aggregate:
      let total = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            //itung value
            value: { $sum: "$value" },
          },
        },
      ]);
      res.status(200).json({
        data: history,
        total: total.length ? total[0].value : 0,
      });
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` });
    }
  },
  historyDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const history = await Transaction.findOne({ _id: id });

      //kondisi kalau id history tidak ada:
      if (!history) {
        return res.status(404).json({ message: "history tidak ada." });
      }

      res.status(200).json({ data: history });
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` });
    }
  },
  dashboard: async (req, res) => {
    try {
      //ambil total daair category yang didapet dari model transaction:
      const counts = await Transaction.aggregate([
        { $match: { player: req.player._id } },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);

      const categories = await Category.find({});

      //bandingin id category dgn count:
      categories.forEach((category) => {
        counts.forEach((count) => {
          //kondisi
          if (count._id.toString() === category._id.toString()) {
            //nambah field name:
            count.name = category.name;
          }
        });
      });

      //dapet history dari Transaction berdasarkan playeer:
      const history = await Transaction.find({ player: req.player._id }).populate("category").sort({ updateAt: -1 });
      //respon berhasil:
      res.status(200).json({ data: history, counts });
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` });
    }
  },
  profile: async (req, res) => {
    try {
      const player = {
        //username, email, name, avatar, phoneNumber
        id: req.player._id,
        name: req.player.name,
        username: req.player.username,
        email: req.player.email,
        avatar: req.player.avatar,
        phoneNumber: req.player.phoneNumber,
      };
      //respon berhasil:
      res.status(200).json({ data: player });
    } catch (err) {
      res.status(500).json({ message: err.message || `Internal server error` });
    }
  },
  editProfile: async (req, res, next) => {
    try {
      const { name = "", phoneNumber = "" } = req.body;
      const payload = {};
      const result = await cloudinary.uploader.upload(req.file.path);

      //kondisi name ada isinya nanti masuk ke payload:
      if (name.length) payload.name = name;
      if (phoneNumber.length) payload.phoneNumber = phoneNumber;

      //kondisi kirim file:
      if (result) {
        // let tmp_path = req.file.path;
        // let originaExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
        // let filename = req.file.filename + "." + originaExt;
        // let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

        // const src = fs.createReadStream(tmp_path);
        // const dest = fs.createWriteStream(target_path);

        // src.pipe(dest);

        let player = await Player.findOne({ _id: req.player._id });
        // let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;
        let currentImage = `${result.secure_url}${player.avatar}`;
        //jika file nya ada didalem cloudinary:
        if (currentImage) {
          // fs.unlinkSync(currentImage);
          //file akan di remove
          await cloudinary.uploader.destroy(user.currentImage);
        }
        //else akan update berdasarkan id:
        player = await Player.findOneAndUpdate(
          { _id: req.player._id },
          {
            ...payload,
            avatar: result.url,
          },
          { new: true, runValidators: true }
        );

        // console.log(player);

        res.status(201).json({
          data: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        });

        // src.on("err", async () => {
        //   next(err);
        // });
      } else {
        const player = await Player.findOneAndUpdate(
          {
            _id: req.player._id,
          }, //kirim payload:
          payload,
          { new: true, runValidators: true }
        );

        res.status(201).json({
          data: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        });
      }
    } catch (err) {
      if (err && err.name === "validationError") {
        res.status(422).json({
          error: 1,
          messgae: err.message,
          fields: err.errors,
        });
      }
    }
  },
};
