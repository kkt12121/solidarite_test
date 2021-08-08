const express = require("express");
const router = express.Router();
const checkToken = require("./checkToken");

const { boardController } = require("../controller");

// * POST /create
router.post("/", checkToken, boardController.create.post);

// * GET /list
router.get("/", boardController.list.get);

// * POST /like
router.post("/:id/like", checkToken, boardController.like.post);

module.exports = router;
