const leaderboardRouter = require("express").Router()
const {getLeaderboard} = require("../controllers/leaderboard.controller")

leaderboardRouter.get("/" , getLeaderboard)

module.exports = leaderboardRouter