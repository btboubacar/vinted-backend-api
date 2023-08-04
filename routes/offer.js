const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const User = require("../models/User");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middleware/isAuthenticated");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

// Get offer(s)
router.get("/offers", isAuthenticated, fileUpload(), async (req, res) => {
  try {
    const minPrice = 0;
    const maxPrice = 100_000;

    const title = req.query.title;
    const priceMin = req.query.priceMin;
    const priceMax = req.query.priceMax;
    const sortQuery = req.query.sort;
    const page = req.query.page || 1;
    const itemsPerPage = 10;

    // const filters = {
    //   product_name: new RegExp(title, "i") || "",
    //   product_price: { $lte: priceMax, $gte: priceMin },
    // };

    const filters = {};
    if (title) {
      filters.product_name = new RegExp(title, "i");
    }

    if (priceMin) filters.product_price = { $gte: priceMin };
    if (priceMax) {
      if (filters.product_price) filters.product_price.$lte = priceMax;
      else filters.product_price = { $lte: priceMax };
    }

    const sortObj = {};
    if (sortQuery === "price-desc") sortObj.product_price = "desc";
    else if (sortQuery === "price-asc") sortObj.product_price = "asc";

    const offersCount = await Offer.find(filters)
      .sort(sortObj)
      .populate("owner", "account");
    const totalCount = offersCount.length;

    const offers = await Offer.find(filters)
      .sort(sortObj)
      //.populate("owner", "account")
      .limit(itemsPerPage)
      .skip(itemsPerPage * (page - 1))
      .select("product_name product_price -_id");

    res.status(200).json({ count: totalCount, offers: offers });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// post offer
router.post("/offers", isAuthenticated, fileUpload(), async (req, res) => {
  try {
    const { title, description, price, brand, size, condition, color, city } =
      req.body;

    const newOffer = new Offer({
      product_name: title,
      product_description: description,
      product_price: price,
      product_details: [
        {
          MARQUE: brand,
        },
        {
          TAILLE: size,
        },
        {
          ETAT: condition,
        },
        {
          COULEUR: color,
        },
        {
          EMPLACEMENT: city,
        },
      ],
    });
    newOffer.owner = req.user;

    // check if input images is array or not
    if (req.files && !Array.isArray(req.files.picture)) {
      if (req.files.picture.mimetype.slice(0, 5) !== "image")
        throw { status: 400, message: "File must be an image type" };
      else {
        const fileUpload = convertToBase64(req.files.picture);
        const uploadResult = await cloudinary.uploader.upload(fileUpload, {
          folder: `/vinted/offers/${newOffer._id}`,
          public_id: "productPreview",
        });

        newOffer.product_image = uploadResult;
      }
    } else if (Array.isArray(req.files.picture)) {
      // check that all files of image type before sending to cloudinary
      for (let j = 0; j < req.files.picture.length; j++) {
        if (req.files.picture[j].mimetype.slice(0, 5) !== "image")
          throw { status: 400, message: "File(s) must be of image type" };
      }
      for (let i = 0; i < req.files.picture.length; i++) {
        if (i === 0) {
          const fileUpload = convertToBase64(req.files.picture[i]);
          const uploadResult = await cloudinary.uploader.upload(fileUpload, {
            folder: `/vinted/offers/${newOffer._id}`,
            public_id: "productPreview",
          });

          newOffer.product_image = uploadResult;
        } else {
          const fileUpload = convertToBase64(req.files.picture[i]);
          const uploadResult = await cloudinary.uploader.upload(fileUpload, {
            folder: `/vinted/offers/${newOffer._id}`,
          });

          newOffer.product_pictures[i - 1] = uploadResult;
        }
      }
    }

    // // const keysObjUser = Object.keys(req.user.account);
    // // if (keysObjUser.includes("avatar")) {
    // //   req.user.account.avatar = { secure_url: uploadResult.secure_url };
    // // }

    await newOffer.save();

    res.status(201).json(newOffer);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

// update/modify offer
router.put(
  "/offers/:offerId",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const existingOffer = await Offer.findById(req.params.offerId);
      if (!existingOffer) throw { status: 400, message: "Invalid request" };

      const { title, description, price, brand, size, condition, color, city } =
        req.body;

      existingOffer.product_name = title || existingOffer.product_name;
      existingOffer.product_description =
        description || existingOffer.product_description;
      existingOffer.product_price = price || existingOffer.product_price;
      existingOffer.product_details[0].MARQUE =
        brand || existingOffer.product_details[0].MARQUE;
      existingOffer.product_details[1].TAILLE =
        size || existingOffer.product_details[1].TAILLE;
      existingOffer.product_details[2].ETAT =
        condition || existingOffer.product_details[2].ETAT;
      existingOffer.product_details[3].COULEUR =
        color || existingOffer.product_details[3].COULEUR;
      existingOffer.product_details[4].EMPLACEMENT =
        city || existingOffer.product_details[4].EMPLACEMENT;

      if (req.files) {
        const fileUpload = convertToBase64(req.files.picture);
        const uploadResult = await cloudinary.uploader.upload(fileUpload, {
          folder: `/vinted/offers/${existingOffer._id}`,
        });
        existingOffer.product_image = {
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          signature: uploadResult.signature,
        };
      }

      existingOffer.markModified("product_details");
      existingOffer.markModified("product_image");
      await existingOffer.save();

      res.status(200).json(existingOffer);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Internal server error" });
    }
  }
);

// delete offer
router.delete(
  "/offers/:offerId",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const existingOffer = await Offer.findById(req.params.offerId);
      if (!existingOffer) throw { status: 400, message: "Invalid request" };

      await Offer.deleteOne({ _id: req.params.offerId });
      //const deletedItem = await Offer.deleteOne({ _id: req.params.offerId });

      res.status(200).json({ message: "Item successfully deleted" });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Internal server error" });
    }
  }
);

// get offer by id:
router.get("/offers/:id", isAuthenticated, async (req, res) => {
  try {
    if (!req.params.id) throw { status: 400, message: "Invalid request" };

    const existingOffer = await Offer.findById(req.params.id).populate(
      "owner",
      "account"
    );

    res.status(200).json(existingOffer);
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
});

module.exports = router;
