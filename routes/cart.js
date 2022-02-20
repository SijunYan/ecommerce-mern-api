const Cart = require("../models/Cart");
const {
  verifyToken,
  authorize,
  adminAuthorize,
} = require("./verifyTokenAuthorize");
const router = require("express").Router();

// ======================== Create ==================================
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ========================update ==================================
router.put("/:id", verifyToken, authorize, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ========================delete ==================================
router.delete("/:id", verifyToken, authorize, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// ========================get user Cart ==================================
router.get("/find/:userId", verifyToken, authorize, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.body.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ========================get all ==================================
router.get("/", verifyToken, adminAuthorize, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
