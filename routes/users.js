const express = require("express");

const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;

router.get("/meow", function (req, res, next) {
  res.send("You're so meow");
});