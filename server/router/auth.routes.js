const authRouter = require("express").Router()
const {signUp , signIn , signOut} = require("../controllers/auth.controller")

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.post("/signout", signOut)

module.exports = authRouter