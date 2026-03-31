const authRouter = require("express").Router()
const {signUp , signIn , signOut , autoSignIn} = require("../controllers/auth.controller")
const protect = require("../middlewares/protect")

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.post("/signout", signOut)
authRouter.get("/auto-signin", protect , autoSignIn)

module.exports = authRouter