/* eslint-disable no-unused-vars */
const User = require("../models/user");

exports.user_list = (req, res, next) => {
  User.find()
    .exec((error, user_list) => {
      if (error) {
        return next(error);
      }
      res.render("user_list", { title: "User List", user_list });
    });
};

exports.user_dashboard = (req, res, next) => {
  if (!(req?.session.userId)) {
    return res.redirect("/user/login");
  }

  User.findById(req.session.userId, (error, user) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.redirect("/user/login");
    }
    res.send("Dashboard => Here");
  });
};

exports.register_get = (req, res, next) => {
  res.render("user_register_form", { title: "User Registration" });
};

exports.register_post = (req, res, next) => {
  const user = new User(req.body);

  user.save((err) => {
    if (err) {
      let error = "Something bad happened! Please try again.";

      if (err.code === 11000) {
        error = "That email is already taken, please try another!";
      }
      return res.render("user_register_form", {
        errors: [{ msg: error }],
      });
    }
    res.redirect("/user/dashboard");
  });
};

exports.login_get = (req, res, next) => {
  res.render("user_login_form", { title: "User Login" });
};

exports.login_post = (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user || req.body.password !== user.password) {
      return res.render("user_login_form", {
        errors: [{ msg: "Incorrect email / password." }],
      });
    }

    req.session.userId = user._id;
    res.redirect("/user/dashboard");
  });
};
