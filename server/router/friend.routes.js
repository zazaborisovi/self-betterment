const friendRouter = require("express").Router()
const {
    getFriendRequests,
    getFriends,
} = require("../controllers/friend.controller")
const protect = require("../middlewares/protect")

friendRouter.get("/requests", protect , getFriendRequests)
friendRouter.get("/", protect , getFriends)

module.exports = friendRouter