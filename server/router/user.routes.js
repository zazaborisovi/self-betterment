const userRouter = require("express").Router()
const {setChoices , getUserProfile} = require("../controllers/user.controller")
const protect = require("../middlewares/protect")

userRouter.post("/" , protect , setChoices)
userRouter.get("/profile/:id" , protect , getUserProfile)

module.exports = userRouter