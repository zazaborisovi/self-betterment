const friendRouter = require("express").Router()
const {
    getFriendRequests,
    getFriends,
} = require("../controllers/friend.controller")

friendRouter.get("/requests", getFriendRequests)
friendRouter.get("/", getFriends)

module.exports = friendRouter