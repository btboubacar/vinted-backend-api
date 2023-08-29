require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());

const userRouter = require("./routes/user");
const offerRouter = require("./routes/offer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI_LOCAL);

app.get("/", (req, res) => {
  try {
    res.status(200).json("Welcome to Vinted web server");
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

// user route
app.use(userRouter);

// offer route
app.use(offerRouter);

app.all("*", (req, res) => {
  res.status(404).json("Service/route not found");
});

app.listen(process.env.PORT, () => {
  console.log("Server started on PORT => " + process.env.PORT);
});
