const express = require("express");
const {getUser,getProfile,userRegister, userLogin} = require("../controllers/userControllers");

const router = express.Router();

router.get("/", getUser);
router.get("/profile/:id", getProfile)

router.post("/register",userRegister)
router.post("/login", userLogin)

module.exports = router;
