const Like = require("../models/Like");
const { createLog } = require("../utils/actions");
const jwt = require("jsonwebtoken");

exports.create = (req, res) => {
  const token = req.headers.authorization;
  const user = jwt.decode(token.split(" ")[1]);
  const like = new Like(req.body);
  like.user = user.id;
  like.save()
    .then(() => {
      return res.status(201).json({ success: true });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err });
    });
};
exports.getMe = async (req, res) => {
  const token = req.headers.authorization;
  const user = jwt.decode(token.split(" ")[1]);
  await Like.find({ user: user.id })
    .sort({ createdAt: -1 })
    .skip((req.query.page - 1) * req.query.limit)
    .limit(parseInt(req.query.limit))
    .populate("product")
    .exec((err, data) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, data });
    });
};

exports.rm = async (req, res) => {
  await Like.deleteOne({ _id: req.params.id }).exec((err, data) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
};