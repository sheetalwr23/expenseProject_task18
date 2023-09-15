const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    const user = jwt.verify(token, "sheetalkey");
    console.log(user);
    console.log("userID >>>> ", user.userId);
    User.findByPk(user.userId)
      .then((user) => {
        console.log("user>>", user);
        console.log(JSON.stringify(user));
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    console.log("error" + err);
    return res.status(401).json({ error: err });
  }
};

module.exports = {
  authenticate: authenticate,
};
