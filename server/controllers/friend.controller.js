const User = require("../models/user.model")
const FriendRequest = require("../models/friend.request.model")
const Friendship = require("../models/friendship.model")

const sendFriendRequest = async (req, res) => {
    try {
        const { to } = req.params
        const from = req.user._id

        if (!await User.findById(to)) return res.status(404).json({ message: "user not found" })

        if (from.toString() === to.toString()) return res.status(400).json({ message: "you can not send request to yourself" })

        if (await FriendRequest.findOne({ $or: [{ from, to }, { from: to, to: from }] })) return res.status(400).json({ message: "request already sent" })
        if (await Friendship.findOne({ $or: [{ user1: from, user2: to }, { user1: to, user2: from }] })) return res.status(400).json({ message: "already friends" })

        const request = new FriendRequest({ from, to })
        await request.save()
        return res.status(200).json({ message: "request sent" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const acceptFriendRequest = async (req, res) => {
    try {
        const friendRequest = await FriendRequest.findById(req.params.friendRequestId)

        if (!friendRequest) return res.status(404).json({ message: "request not found" })
        if (friendRequest.to.toString() !== req.user._id.toString()) return res.status(403).json({ message: "unauthorized" })

        const friendship = new Friendship({ user1: friendRequest.from, user2: friendRequest.to })
        await friendship.save()
        await FriendRequest.findByIdAndDelete(friendRequest._id)
        return res.status(200).json({ message: "request accepted" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

const rejectFriendRequest = async (req, res) => {
    try {
        const friendRequest = await FriendRequest.findById(req.params.friendRequestId)

        if (!friendRequest) return res.status(404).json({ message: "request not found" })
        if (friendRequest.to.toString() !== req.user._id.toString()) return res.status(403).json({ message: "unauthorized" })

        await friendRequest.deleteOne()
        return res.status(200).json({ message: "request rejected" })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

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
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    getFriends,
    removeFriend
}
