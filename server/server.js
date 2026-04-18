require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const http = require("http")
const {Server} = require("socket.io")
const socketProtect = require("./middlewares/socketProtect")
const Sentry = require("@sentry/node");
const {rateLimit} = require("express-rate-limit")

// api imports
const authRouter = require("./router/auth.routes")
const userRouter = require("./router/user.routes")
const adminRouter = require("./router/admin.routes")
const oauthRouter = require("./router/oauth.routes")

// socket function imports
const {getTasks , completeTask} = require("./sockets/tasks.socket")
const {sendFriendRequest , acceptFriendRequest , rejectFriendRequest , removeFriend, cancelFriendRequest, getFriends, getFriendRequests} = require("./sockets/friends.socket")
const {getGlobalLeaderboard , getFriendLeaderboard} = require("./sockets/leaderboard.socket")
const {sendMessage, getChats, getMessages, joinChat, markAsRead} = require("./sockets/chat.socket")
const { setChoices, getAllUsers } = require("./sockets/user.socket")

// host
app.use(express.static(path.join(__dirname, '../client/dist')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
   });

// app initialization
const app = express()

// middleware
app.use(express.json())
app.use(cors({
    origin: [
        `${process.env.REACT_URL}`,
        `${process.env.EXPO_URL}`,
    ],
    credentials: true
}))
app.use(cookieParser())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})
app.use(limiter)

const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin: [
            `${process.env.REACT_URL}`,
            `${process.env.EXPO_URL}`
        ],
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

    // task sockets
    socket.on("complete-task" ,  async(data) =>{
        await completeTask(socket , socketUser , data)
    })
    socket.on("get-tasks" , async() =>{
        await getTasks(socket , socketUser)
    })

    // friend sockets
    socket.on("get-friends" , async() =>{
        await getFriends(socket , socketUser)
    })
    socket.on("get-friend-requests" , async() =>{
        await getFriendRequests(socket , socketUser)
    })
    socket.on("send-friend-request", async (data) =>{
        await sendFriendRequest(io , socket , socketUser , data)
    })
    socket.on("reject-friend-request", async (data) =>{
        await rejectFriendRequest(socket , socketUser , data)
    })
    socket.on("accept-friend-request", async (data) =>{
        await acceptFriendRequest(io , socket , socketUser , data)
    })
    socket.on("remove-friend", async (data) =>{
        await removeFriend(socket , socketUser , data)
    })
    socket.on("cancel-friend-request", async (data) =>{
        await cancelFriendRequest(socket , socketUser , data)
    })

    // leaderboard sockets
    socket.on("get-global-leaderboard" , async() =>{
        await getGlobalLeaderboard(socket)
    })
    socket.on("get-friend-leaderboard" , async() =>{
        await getFriendLeaderboard(socket , socketUser)
    })

    // chat sockets
    socket.on("send-message" , async(data) =>{
        await sendMessage(io , socket , socketUser , data)
    })
    socket.on("get-chats" , async() =>{
        await getChats(socket , socketUser)
    })
    socket.on("get-messages" , async(data) =>{
        await getMessages(socket , socketUser , data)
    })
    socket.on("join-chat" , async(data) =>{
        await joinChat(io , socket , socketUser , data)
    })
    socket.on("mark-as-read" , async(data) =>{
        await markAsRead(socket , socketUser , data)
    })

    // user sockets
    socket.on("set-choices" , async(data) =>{
        await setChoices(socket , socketUser , data)
    })
    socket.on("get-all-users" , async() =>{
        await getAllUsers(socket , socketUser)
    })
})

// api
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/admin" , adminRouter)
app.use("/api/oauth", oauthRouter)

// sentry
Sentry.setupExpressErrorHandler(app)

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
});


// database / server connection
mongoose.connect(process.env.MONGODB_URI).then(() =>{
    console.log("database connected")

    server.listen(process.env.PORT, () =>{
        console.log("server connected at port ", process.env.PORT)
    })
}).catch((err) =>{
    console.log(err)
})