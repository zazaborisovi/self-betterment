const userRouter = require("express").Router()
const {getUserProfile} = require("../controllers/user.controller")
const protect = require("../middlewares/protect")

userRouter.get("/profile/:id" , protect , getUserProfile)

module.exports = userRouter