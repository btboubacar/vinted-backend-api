const mongoose = require("mongoose");

const User = require("./User");

const Schema = {
  product_name: { type: String, maxlength: 50 },
  product_description: { type: String, maxlength: 500 },
  product_price: { type: Number, max: 100_000 },
  product_details: Array,
  product_image: Object,
  product_pictures: [Array],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};
const Offer = mongoose.model("Offer", Schema);

module.exports = Offer;
