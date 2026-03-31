const userRouter = require("express").Router()
const {setChoices} = require("../controllers/user.controller")
const protect = require("../middlewares/protect")

userRouter.post("/" , protect , setChoices)

module.exports = userRouter