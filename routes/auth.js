const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  // console.log('Time: ', Date.now())
  next();
});

// ========================   register ================================
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ========================  login  ===========================================
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json("Wrong credentials!");
    const decrypt = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET
    ).toString(CryptoJS.enc.Utf8);
    if (decrypt !== req.body.password)
      return res.status(401).json("Wrong credentials!");
    const { password, ...others } = user._doc;
    const accessToken = jwt.sign(others, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
