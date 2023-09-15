const express = require("express");
const app = express();
const sequelize = require("sequelize");
const path = require("path");
const sequelize_db = require("./util/expense");
const user = require("./models/user");
const Expense = require("./models/expense");
const bodyParser = require("body-parser");
const router = require("./routes/user");
const controller = require("./controller/user");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const premiumFeatureRoutes = require("./routes/premiumFeatures");
const Order = require("./models/orders");
const purchaseRoutes = require("./routes/purchase");
const resetPasswordRoutes = require("./routes/resetpwd");
const Forgotpassword = require("./models/resetpwd");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);
app.use("/", purchaseRoutes);
app.use("/premium", premiumFeatureRoutes);
app.use("/password", resetPasswordRoutes);

user.hasMany(Expense);
Expense.belongsTo(user);

user.hasMany(Order);
Order.belongsTo(user);

user.hasMany(Forgotpassword);
Forgotpassword.belongsTo(user);

sequelize_db
  .sync({ alter: true })
  .then(() => {
    app.listen(3000);
    console.log("listening to port 3000");
    console.log("Table created");
  })
  .catch((err) => {
    console.error("Error creating table:", err);
  });
