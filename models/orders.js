const Sequelize = require("sequelize");
const sequelize_db = require("../util/expense");
const Order = sequelize_db.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  paymentid: Sequelize.STRING,
  orderid: Sequelize.STRING,
  status: Sequelize.STRING,
});
module.exports = Order;
