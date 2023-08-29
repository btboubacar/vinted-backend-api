require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const cors = require("cors");
router.use(cors());

router.post("/payment", async (req, res) => {
  try {
    console.log(req.body);
    console.log(typeof req.body.price);
    const stripeToken = req.body.stripeToken;
    const price = Number(req.body.price);

    const responseFromStripe = await stripe.charges.create({
      amount: Math.round(price) * 100, //cents
      currency: "eur",
      description: req.body.description,
      source: stripeToken,
    });

    res.status(201).json(responseFromStripe);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

module.exports = router;
