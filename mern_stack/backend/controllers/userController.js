const User = require('../models/userModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

const loginUser = async (req, res) => {
    const {email, password} = req.body
   
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.status(200).json({email, token})
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
        
}

const signupUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.signup(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    } 
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

const sendFriendRequest = async (req, res) => {
    const {userId, targetUserId} = req.body

    try {
        const user = await User.findById(userId)
        const targetUser = await User.findById(targetUserId)
        
        if (targetUser.friendship.pending.includes(user._id)) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        if (user.friendship.pending.includes(targetUser._id)) {
            //add friend here
            user.friendship.pending = user.friendship.pending.filter(id => id.toString() !== targetUser._id.toString());
            targetUser.friendship.accepted.push(user._id)
            user.friendship.accepted.push(targetUser._id)

            await user.save();
            await targetUser.save();

            return res.status(200).json({message: "friend successfully added!"})
        }

        targetUser.friendship.pending.push(user._id)
        await targetUser.save();

        res.status(200).json({message: "Friend request sent!"})
    }
    catch (error) {
        return res.status(500).json({message: "Something went wrong: sendFriendRequest"})
    }
}

const addFriend = async (req, res) => {
    const {userId, incomingUserId} = req.body;

    try {
        const user = await User.findById(userId);
        const incomingUser = await User.findById(incomingUserId);
        
        if (user.friendship.accepted.includes(incomingUser._id)) {
            return res.status(400).json({ message: "Friend already on friend list" });
        }

        if (!user.friendship.pending.includes(incomingUser._id)) {
            return res.status(400).json({ message: "No pending friend request found." });
        }

        user.friendship.pending = user.friendship.pending.filter(id => id.toString() !== incomingUser._id.toString());
        user.friendship.accepted.push(incomingUser._id);
        incomingUser.friendship.accepted.push(user._id);

        // Save both users
        await incomingUser.save();
        await user.save();

        res.status(200).json({message: "Friend request accepted!"});

    } catch (error) {
        return res.status(500).json({message: "Something went wrong: addFriend"});
    }
}


module.exports = { signupUser, loginUser, sendFriendRequest, addFriend }