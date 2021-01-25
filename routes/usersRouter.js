const express = require("express");

const { loginRequired } = require("./authen_helper");

const router = express.Router();
const user_controller = require("../controllers/userController");

router.get("/list/all", user_controller.user_list);

router.get("/dashboard", loginRequired, user_controller.user_dashboard);

router.get("/register", user_controller.register_get);

router.post("/register", user_controller.register_post);

router.get("/login", user_controller.login_get);

router.post("/login", user_controller.login_post);

module.exports = router;