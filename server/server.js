require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const http = require("http")
const {Server} = require("socket.io")
const socketProtect = require("./middlewares/socketProtect")

// api imports
const authRouter = require("./router/auth.routes")
const friendRouter = require("./router/friend.routes")
const taskRouter = require("./router/tasks.routes")
const userRouter = require("./router/user.routes")
const leaderboardRouter = require("./router/leaderboard.routes")
const adminRouter = require("./router/admin.routes")

// socket function imports
const completeTask = require("./sockets/tasks.socket")
const {sendFriendRequest , acceptFriendRequest , rejectFriendRequest , removeFriend} = require("./sockets/friends.socket")

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
io.use(socketProtect)

io.on("connection", (socket) =>{
    const socketUser = socket.request.user
    if(socketUser){
        socket.join(socketUser._id.toString())
    }

    socket.on("complete-task" ,  async(data) =>{
        await completeTask(socket , socketUser , data)
    })
    socket.on("send-friend-request", async (data) =>{
        await sendFriendRequest(io , socket , socketUser , data)
    })
    socket.on("reject-friend-request", async (data) =>{
        await rejectFriendRequest(io , socket , socketUser , data)
    })
    socket.on("accept-friend-request", async (data) =>{
        await acceptFriendRequest(io , socket , socketUser , data)
    })
    socket.on("remove-friend", async (data) =>{
        await removeFriend(io , socket , socketUser , data)
    })
})

// api
app.use("/api/auth", authRouter)
app.use("/api/friends", friendRouter)
app.use("/api/tasks", taskRouter)
app.use("/api/user", userRouter)
app.use("/api/leaderboard" , leaderboardRouter)
app.use("/api/admin" , adminRouter)

// database / server connection
mongoose.connect(process.env.MONGODB_URI).then(() =>{
    console.log("database connected")

    server.listen(process.env.PORT, () =>{
        console.log("server connected at port ", process.env.PORT)
    })
}).catch((err) =>{
    console.log(err)
})