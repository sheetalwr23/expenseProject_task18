const Razorpay = require("razorpay");
const Order = require("../models/orders");
const userController = require("./user");

const purchasepremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: "rzp_test_TZnwMUaR5CSU86",
      key_secret: "dQYw3jYuWd8LTkRebneMFryu",
    });
    const amount = 2500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err), "errrrrrrrrrrr");
      }
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } }); //2
    console.log("order id>>>>", order_id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.update({ ispremiumuser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          success: true,
          message: "Transaction Successful",
          token: userController.generateAccessToken(userId, undefined, true),
        });
      })
      .catch((error) => {
        console.error("Error during Promise.all:", error);
        // return res.status(500).json({ message: "Something went wrong", error: error });
      });
  } catch (err) {
    console.error("Error in updateTransactionStatus:", err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};
