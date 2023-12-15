const express = require("express")
const router = express.Router();
const { createMsg, getMsg } = require("../controllers/msgController");

//controllers
router.post("/", createMsg);
router.get("/:chatId", getMsg);

module.exports = router;
