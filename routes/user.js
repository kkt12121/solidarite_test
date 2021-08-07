const express = require("express");
const router = express.Router();

const { userController } = require("../controller");

// * POST /join
router.post("/join", userController.join.post);

// * POST /login
router.post("/login", userController.login.post);

module.exports = router;
