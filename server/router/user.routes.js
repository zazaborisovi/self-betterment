const userRouter = require("express").Router()
const {getUserProfile , changeProfilePicture} = require("../controllers/user.controller")
const protect = require("../middlewares/protect")
const upload = require("../utils/multer")

userRouter.get("/profile/:id" , protect , getUserProfile)
userRouter.post("/change-profile-picture", protect , upload.single("file") , changeProfilePicture)

module.exports = userRouter