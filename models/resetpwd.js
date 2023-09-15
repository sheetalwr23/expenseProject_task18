const Sequelize = require("sequelize");
const sequelize = require("../util/expense");

const Forgotpass = sequelize.define("forgotpass", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
  },
  active: {
    type: Sequelize.BOOLEAN,
  },
  expiresby: {
    type: Sequelize.DATE,
  },
});

module.exports = Forgotpass;
