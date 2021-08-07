const express = require("express");
const router = express.Router();
const checkToken = require("./checkToken");

const { boardController } = require("../controller");

// * POST /create
router.post("/", checkToken, boardController.create.post);

module.exports = router;
