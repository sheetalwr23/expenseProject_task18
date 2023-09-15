const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
const exController = require("../controller/expense");
const path = require("path");
const userAuthentication = require("../middleware/auth");
const createExpenseController = require("../controller/expense");
router.use(express.static(path.join(__dirname, "public")));
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
//user
router.post("/signup", controller.createSignupController);
router.post("/login", controller.createloginController);
//expense routes
router.post(
  "/expense",
  userAuthentication.authenticate,
  exController.createExpenseController
);

router.get(
  "/expense",
  userAuthentication.authenticate,
  exController.getExpenseController
);
router.delete(
  "/expense/:id",
  userAuthentication.authenticate,
  exController.deleteExpense
);
router.get(
  "/expense/pagination",
  userAuthentication.authenticate,
  (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "pagination.html"));
  }
);
router.get(
  "/download",
  userAuthentication.authenticate,
  exController.deleteExpense
);

module.exports = router;
