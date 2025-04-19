const express = require("express")
const router = express.Router()

const { signupUser, loginUser, sendFriendRequest, addFriend } = require('../controllers/userController')


router.post('/login', loginUser)
router.post('/signup', signupUser)
router.post('/:targetUserId/pending', sendFriendRequest)
router.post('/:userId/accepted', addFriend)

module.exports = router