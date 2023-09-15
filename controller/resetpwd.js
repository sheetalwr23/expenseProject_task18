const uuid = require("uuid");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer"); // Add this line

const User = require("../models/user");
const Forgotpassword = require("../models/resetpwd");

const forgotpassword = async (req, res) => {
  console.log("Forgot password request received");

  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    // Find the user first before checking if it exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const id = uuid.v4();

    // Create a new forgotpassword entry
    const forgotPasswordEntry = await Forgotpassword.create({
      id,
      active: true,
      userId: user.id,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "sknayak8338@gmail.com",
        pass: "pFm7yDYT2vcWPCxG",
      },
    });

    const mailOptions = {
      from: "sknayak8338@gmail.com",
      to: "sknayak8338@gmail.com",
      subject: "Please reset the password",
      text: "and easy to do anywhere, even with Node.js",
      html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Error sending email", success: false });
      }
      return res.status(200).json({
        message: "Link to reset password sent to your mail",
        success: true,
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message, success: false });
  }
};

const resetpassword = (req, res) => {
  const id = req.params.id;
  Forgotpassword.findOne({ where: { id } }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};

const updatepassword = (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    Forgotpassword.findOne({ where: { id: resetpasswordid } }).then(
      (resetpasswordrequest) => {
        User.findOne({ where: { id: resetpasswordrequest.userId } }).then(
          (user) => {
            console.log("userDetails", user);
            if (user) {
              //encrypt the password

              const saltRounds = 10;
              bcrypt.genSalt(saltRounds, function (err, salt) {
                if (err) {
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt, function (err, hash) {
                  // Store hash in your password DB.
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.update({ password: hash }).then(() => {
                    res
                      .status(201)
                      .json({ message: "Successfuly update the new password" });
                  });
                });
              });
            } else {
              return res
                .status(404)
                .json({ error: "No user Exists", success: false });
            }
          }
        );
      }
    );
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword,
};
