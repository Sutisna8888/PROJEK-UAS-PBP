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
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");
const checkUser = require("../middlewares/checkUser");

const router = express.Router();

router.get("/profile", verifyToken, checkUser, getProfile);
router.get("/profile/:id", verifyToken, checkUser, getProfileById);
router.post("/register", userRegister);
router.post("/login", userLogin);
router.put("/user", verifyToken, checkUser, editUser);
router.delete("/logout", verifyToken, checkUser, userLogout);

// postingan
router.get("/posts", verifyToken, checkUser, getPosts);
router.post("/post", verifyToken, checkUser, buatPost);
router.get("/post/:PostID", verifyToken, checkUser, getPostById);
router.put("/post/:PostID", verifyToken, checkUser, editPost);
router.delete("/post/:PostID", verifyToken, checkUser, deletePost);
router.post("/comment", verifyToken, checkUser, userComments);
router.get("/comment/:PostID", verifyToken, checkUser, getcomment);
router.delete("/comment/:CommentID", verifyToken, checkUser, deletComment);
router.post("/like", verifyToken, checkUser, userLike);
router.delete("/like/:LikeID", verifyToken, checkUser, deletlike);

// report
router.post("/report", verifyToken, checkUser, userReport);

module.exports = router;
