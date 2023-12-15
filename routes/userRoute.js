const express = require("express")
const router = express.Router();
const { registerUser,loginUser,findUser,getUser } = require("../controllers/userController");

//controllers
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/get-user", getUser);

module.exports = router;

