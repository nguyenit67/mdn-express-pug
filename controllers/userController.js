/* eslint-disable no-unused-vars */
const User = require("../models/user");

exports.register_get = (req, res, next) => {
  res.render("user_register_form", { title: "User Registration" });
};

exports.register_post = (req, res, next) => {
  const user = new User(req.body);

  user.save((err) => {
    if (err) {
      let error = "Something bad happened! Please try again.";

      // @ts-ignore
      if (err.code === 11000) {
        error = "That email is already taken, please try another!";
      }
      return res.render("user_register_form", {
        errors: [{ msg: error }],
      });
    }
    res.redirect("/user/desk");
  });
};

exports.login_get = (req, res, next) => {
  // code
  res.send("Not implemented yet!");
};

exports.login_post = (req, res, next) => {
  // code
};
