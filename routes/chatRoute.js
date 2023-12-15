const express = require("express")
const router = express.Router();
const { createChat, findUserChats, findChat  } = require("../controllers/chatController");

//controllers
router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
