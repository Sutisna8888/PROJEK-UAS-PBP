const {
  adminRegister,
  adminLogin,
  adminLogout,
  getUsers,
  deleteUser,
} = require("../controllers/adminController");

const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { getReports } = require("../controllers/userController");

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/logout", verifyToken, adminLogout);
router.get("/reports", verifyToken, getReports);
router.get("/users", verifyToken, getUsers);
router.delete("/users/:UserID", verifyToken, deleteUser);

module.exports = router;
