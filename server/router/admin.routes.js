const adminRouter = require("express").Router()
const { getAllUsers, updateUser, deleteUser } = require("../controllers/admin.controller")
const protect = require("../middlewares/protect")
const allowedTo = require("../middlewares/allowedTo")


adminRouter.get("/" , protect , allowedTo(["admin"]) , getAllUsers)
adminRouter.put("/update/:userId", protect , allowedTo(["admin"]) , updateUser)
adminRouter.delete("/delete/:userId", protect , allowedTo(["admin"]) , deleteUser)

module.exports = adminRouter