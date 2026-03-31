require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const http = require("http")
const {Server} = require("socket.io")

// api imports
const authRouter = require("./router/auth.routes")
const friendRouter = require("./router/friend.routes")
const taskRouter = require("./router/tasks.routes")
const userRouter = require("./router/user.routes")

// app initialization
const app = express()

// middleware
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())

const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin: "http://localhost:5173",
        credentials: true
    }
})

// socket
io.on("connection", (socket) =>{
    console.log(socket.id , "connected")
})

// api
app.use("/api/auth", authRouter)
app.use("/api/friends", friendRouter)
app.use("/api/tasks", taskRouter)
app.use("/api/user", userRouter)

// database / server connection
mongoose.connect(process.env.MONGODB_URI).then(() =>{
    console.log("database connected")

    server.listen(process.env.PORT, () =>{
        console.log("server connected at port ", process.env.PORT)
    })
}).catch((err) =>{
    console.log(err)
})