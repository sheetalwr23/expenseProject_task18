const express = require("express");

const purchaseController = require("../controller/purchase");

const authenticatemiddleware = require("../middleware/auth");

const router = express.Router();

router.get(
  "/purchase/premiummembership",
  authenticatemiddleware.authenticate,
  purchaseController.purchasepremium
);

router.post(
  "/purchase/updatetransactionstatus",
  authenticatemiddleware.authenticate,
  purchaseController.updateTransactionStatus
);

module.exports = router;
