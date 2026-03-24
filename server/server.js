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

// app initialization
const app = express()

// middleware
app.use(express.json())
app.use(cors({
    origin: "*",
    credentials: true
}))
app.use(cookieParser())

const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin: "*",
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

// database / server connection
mongoose.connect(process.env.MONGODB_URI).then(() =>{
    console.log("database connected")

    server.listen(process.env.PORT, () =>{
        console.log("server connected at port ", process.env.PORT)
    })
}).catch((err) =>{
    console.log(err)
})