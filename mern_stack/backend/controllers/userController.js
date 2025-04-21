// controllers/userController.js

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) =>
  jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token, _id: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token, _id: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sendFriendRequest = async (req, res) => {
  const { userId, targetUserId } = req.body;
  try {
    const user = await User.findById(userId);
    const target = await User.findById(targetUserId);

    // already sent?
    if (target.friendship.pending.includes(user._id)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // mutual accept shortcut
    if (user.friendship.pending.includes(target._id)) {
      // remove from pending
      user.friendship.pending = user.friendship.pending.filter(
        id => id.toString() !== target._id.toString()
      );
      // add to accepted both ways
      target.friendship.accepted.push(user._id);
      user.friendship.accepted.push(target._id);

      await user.save();
      await target.save();
      return res.status(200).json({ message: "Friend successfully added!" });
    }

    // otherwise push into target's pending
    target.friendship.pending.push(user._id);
    await target.save();
    res.status(200).json({ message: "Friend request sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong: sendFriendRequest" });
  }
};

const addFriend = async (req, res) => {
  const { userId, incomingUserId } = req.body;

  try {
    const user = await User.findById(userId);
    const incoming = await User.findById(incomingUserId);

    // 1) Always strip them out of pending if present
    user.friendship.pending = user.friendship.pending.filter(
      id => id.toString() !== incoming._id.toString()
    );

    // 2) If they're not already in accepted, push them
    if (!user.friendship.accepted.includes(incoming._id)) {
      user.friendship.accepted.push(incoming._id);
    }
    if (!incoming.friendship.accepted.includes(user._id)) {
      incoming.friendship.accepted.push(user._id);
    }

    // 3) Save both
    await user.save();
    await incoming.save();

    // 4) Always return 200 so front-end re-fetches a clean list
    res.status(200).json({ message: "Friend request accepted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong: addFriend" });
  }
};

const searchUsers = async (req, res) => {
  const query = req.query.search;
  const currentUserId = req.query.currentUserId;
  if (!query) return res.json([]);

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ],
      _id: { $ne: currentUserId }
    }).select("_id username email");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Search failed." });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("friendship.pending", "username email");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

module.exports = {
  signupUser,
  loginUser,
  sendFriendRequest,
  addFriend,
  searchUsers,
  getUser
};



