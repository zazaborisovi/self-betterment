const FriendRequest = require("../models/friend.request.model")
const Friendship = require("../models/friendship.model")

const getFriendRequests = async (req, res) => {
    try {
        const friendRequests = await FriendRequest.find({ to: req.user._id }).populate("from", "username")
        return res.status(200).json(friendRequests)
    } catch (err) {
        return res.status(500).json({ message: "internal server error" })
    }
}

const getFriends = async (req, res) => {
    try {
        console.log(req.user)
        const friendships = await Friendship.find({ $or: [{ user1: req.user._id }, { user2: req.user._id }] }).populate("user1", "username").populate("user2", "username")
        return res.status(200).json(friendships)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports = {
    getFriendRequests,
    getFriends
}
