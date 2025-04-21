const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
  sendFriendRequest,
  addFriend,
  searchUsers,
  getUser
} = require("../controllers/userController");

// Auth
router.post("/login", loginUser);
router.post("/signup", signupUser);

// Friend functionality
router.post("/send-friend-request", sendFriendRequest);
router.post("/accept-friend-request", addFriend);
router.get("/", searchUsers); // /api/user?search=...
router.get("/:id", getUser); // /api/user/:id for pending requests

module.exports = router;