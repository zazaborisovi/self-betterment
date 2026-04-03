const User = require("../models/user.model")
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
        const friendships = await Friendship.find({ $or: [{ user1: req.user._id }, { user2: req.user._id }] }).populate("user1", "username").populate("user2", "username")
        return res.status(200).json(friendships)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const removeFriend = async (req, res) => {
    try {
        const friendship = await Friendship.findById(req.params.friendshipId)

        if (!friendship) return res.status(404).json({ message: "friendship not found" })
        if (friendship.user1.toString() !== req.user._id.toString() && friendship.user2.toString() !== req.user._id.toString()) return res.status(403).json({ message: "unauthorized" })

        await friendship.deleteOne()
        return res.status(200).json({ message: "friend removed" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports = {
    getFriendRequests,
    getFriends,
    removeFriend
}
