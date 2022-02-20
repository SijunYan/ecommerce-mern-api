const Order = require("../models/Order");
const {
  verifyToken,
  authorize,
  adminAuthorize,
} = require("./verifyTokenAuthorize");
const router = require("express").Router();

// ======================== Create ==================================
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// =======================  Update ==================================
router.put("/:id", verifyToken, adminAuthorize, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ======================== Delete ==================================
router.delete("/:id", verifyToken, adminAuthorize, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// ========================get user Orders ==================================
router.get("/find/:userId", verifyToken, authorize, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.body.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ======================== get all ==================================
router.get("/", verifyToken, adminAuthorize, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ======================== get monthly income ==================================
router.get("/income", verifyToken, adminAuthorize, async (req, res) => {
  try {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1)
    );
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" }, // month value break down from createdAt
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
