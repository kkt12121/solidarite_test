const express = require("express");
const router = express.Router();

const { userController } = require("../controller");

// * POST /join
router.post("/join", userController.join.post);

module.exports = router;
