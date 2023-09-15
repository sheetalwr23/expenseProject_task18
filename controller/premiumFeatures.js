const User = require("../models/user");
const Expense = require("../models/expense");
const user = require("./user");

const getUserLeaderBoard = async (req, res) => {
  try {
    const users = await User.findAll({
      // attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.amount')),'total_cost']],
      // include:[
      //     {
      //         model:Expense,
      //         attributes:[]
      //     }

      // ],
      // group:['user.id'],
      order: [["totalExpense", "DESC"]],
    });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching leaderboard data:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching leaderboard data." });
  }
};

module.exports = {
  getUserLeaderBoard,
};
