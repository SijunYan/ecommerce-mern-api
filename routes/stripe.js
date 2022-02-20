const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
  const token = req.body.stripeToken;
  const charge = await stripe.charges.create(
    {
      amount: 2000,
      currency: "aud",
      source: token,
      description: "My First Test Charge ",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});
module.exports = router;
