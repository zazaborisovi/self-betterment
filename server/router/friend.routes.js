const friendRouter = require("express").Router()
const {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    removeFriend
} = require("../controllers/friend.controller")

friendRouter.post("/send-request/:to", sendFriendRequest)
friendRouter.post("/accept/:friendRequestId", acceptFriendRequest)
friendRouter.post("/reject/:friendRequestId", rejectFriendRequest)
friendRouter.get("/", getFriends)
friendRouter.delete("/remove/:friendshipId", removeFriend)

module.exports = friendRouter