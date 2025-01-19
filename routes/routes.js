const express = require("express");
const {
  getProfile,
  getProfileById,
  userRegister,
  userLogin,
  buatPost,
  userComments,
  getcomment,
  deletComment,
  userLike,
  deletlike,
  userLogout,
  editUser,
  getPosts,
  getPostById,
  deletePost,
  editPost,
  userReport,
  getReports,
} = require("../controllers/controllers");
const verifyToken = require("../middlewares/verifyToken");
const {
  adminRegister,
  adminLogin,
  adminLogout,
  getUsers,
  deleteUser,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.get("/profile/:id", verifyToken, getProfileById);
router.post("/register", userRegister);
router.post("/login", userLogin);
router.put("/user", verifyToken, editUser);
router.delete("/logout", userLogout);

// postingan
router.get("/posts", verifyToken, getPosts);
router.post("/post", verifyToken, buatPost);
router.get("/post/:PostID", verifyToken, getPostById);
router.put("/post/:PostID", verifyToken, editPost);
router.delete("/post/:PostID", verifyToken, deletePost);
router.post("/comment", verifyToken, userComments);
router.get("/comment/:PostID", verifyToken, getcomment);
router.delete("/comment/:CommentID", verifyToken, deletComment);
router.post("/like", verifyToken, userLike);
router.delete("/like/:LikeID", verifyToken, deletlike);

// report
router.post("/report", verifyToken, userReport);

// admin
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);
router.post("/admin/logout", verifyToken, adminLogout);
router.get("/admin/reports", verifyToken, getReports);
router.get("/admin/users", verifyToken, getUsers);
router.delete("/admin/users/:UserID", verifyToken, deleteUser);

module.exports = router;
