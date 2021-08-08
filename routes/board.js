const express = require("express");
const router = express.Router();

const { boardController } = require("../controller");

// * POST /create
router.post("/", boardController.create.post);

// * GET /list
router.get("/", boardController.list.get);

// * POST /like
router.post("/:id/like", boardController.like.post);

// * GET /page
router.get("/:id", boardController.page.get);

module.exports = router;
