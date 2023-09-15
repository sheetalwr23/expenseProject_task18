const express = require("express");

const premiumFeatureController = require("../controller/premiumFeatures");

const authenticatemiddleware = require("../middleware/auth");

const router = express.Router();

router.get(
  "/showLeaderBoard",
  authenticatemiddleware.authenticate,
  premiumFeatureController.getUserLeaderBoard
);

module.exports = router;
