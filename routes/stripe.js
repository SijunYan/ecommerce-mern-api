const router = require("express").Router();
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();
const stripe = Stripe(process.env.STRIPE_KEY);

router.post("/", async (req, res) => {
  console.log("payment");
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: "aud",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});
module.exports = router;
