const User = require("../models/User");
const { verifyToken, authorize } = require("./verifyTokenAuthorize");
const CryptoJS = require("crypto-js");
const router = require("express").Router();

router.use((req, res, next) => {
  // console.log('Time: ', Date.now())
  next();
});

// ========================update ==================================
router.put("/:id", verifyToken, authorize, async (req, res) => {
  if (req.body.password) {
    console.log(req.body.password);
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET
    ).toString();

    console.log(req.body.password);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ========================delete ==================================
router.delete("/:id", verifyToken, authorize, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// ========================get user ==================================   // ues query string
router.get("/find", verifyToken, authorize, async (req, res) => {
  try {
    const query = req.query.id;
    const user = await User.findById(query);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ========================get all users ==================================   // only admin could access
router.get("/", verifyToken, authorize, async (req, res) => {
  try {
    const query = req.query.new;
    const users = query ? await User.find().limit(query) : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ========================get stats ==================================
router.get("/stats", verifyToken, authorize, async (req, res) => {
  try {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const usersData = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    console.log(usersData);
    res.status(200).json(usersData);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
