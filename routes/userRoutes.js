const express = require("express");
const {
  getUser,
  getProfile,
  userRegister,
  userLogin,
  buatPost,
  userComments,
  getcomment,
  deletComment,
  userLike,
  deletlike,
} = require("../controllers/userControllers");

const router = express.Router();

router.get("/", getUser);
router.get("/profile/:id", getProfile);
router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/post", buatPost);
router.post("/comment", userComments);
router.get("/comment/:PostID", getcomment);
router.delete("/comment/:CommentID", deletComment);
router.post("/like", userLike);
router.delete("/like/:LikeID", deletlike);

module.exports = router;
