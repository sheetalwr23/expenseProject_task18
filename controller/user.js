const express = require("express");
const user = require("../models/user");
const db = require("../util/expense");
const bcrypt = require("bcrypt");
const Expense = require("../models/expense");
const jwt = require("jsonwebtoken");
//signup
const createSignupController = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    console.log(
      "this is req data>>>>>>>>>>>>>>>>>>>>",
      name,
      phone,
      email,
      password
    );
    if (
      name === undefined ||
      name.length === 0 ||
      phone === undefined ||
      phone.length === 0 ||
      email === undefined ||
      email.length === 0 ||
      password === undefined ||
      password.length === 0
    ) {
      return res
        .status(400)
        .json({ err: "bad parameters something is missing" });
    }
    //pwd encryption
    let saltround = 10;
    bcrypt.hash(password, saltround, async (err, hash) => {
      const data = await user.create({
        name: name,
        phone: phone,
        email: email,
        password: hash,
      });
      console.log("this is created data", data);
      return res.status(200).json({ sign_up: data, message: "posted data" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to create user." });
  }
};

function generateAccessToken(id, name, ispremiumuser) {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser: ispremiumuser },
    "sheetalkey"
  );
}
// Login Controller
const createloginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email>>>>>>>>", email, password);

    if (!email || !password) {
      return res.status(400).json({ message: "Email or password is missing" });
    }

    // Get user data
    const User = await user.findAll({ where: { email: email } });
    console.log("user>>>>>>>>>>>>>>>>>>>>>>>>", User);

    if (User.length > 0) {
      // Compare hashed password with provided password
      bcrypt.compare(password, User[0].password, (err, result) => {
        if (err) {
          console.error("bcrypt error");
          return res.status(500).json({ message: "Internal server error" });
        }
        if (result) {
          return res.status(200).json({
            message: "User logged in successfully",
            token: generateAccessToken(
              User[0].id,
              User[0].name,
              User[0].ispremiumuser
            ),
          });
        } else {
          return res.status(400).json({ message: "Password is not correct" });
        }
      });
    } else {
      return res.status(400).json({ message: "User does not exist" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createSignupController,
  createloginController,
  generateAccessToken,
};
