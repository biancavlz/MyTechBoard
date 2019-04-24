const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { authenticationCheck } = require("./tools/index");

router.get("/techboard", authenticationCheck, (req, res, next) => {
    res.render("techboard");
});

module.exports = router;
