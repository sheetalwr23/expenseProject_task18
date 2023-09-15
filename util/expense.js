const Sequelize = require("sequelize");
const sequelize_db = new Sequelize("expense_project", "root", "Sheetal@2311", {
  dialect: "mysql",
  host: "localhost",
});

sequelize_db
  .authenticate()
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("can not connect to database");
  });
module.exports = sequelize_db;
