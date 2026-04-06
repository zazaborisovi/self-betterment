const User = require("../models/user.model")

const getGlobalLeaderboard = async(socket) =>{
    try{
        const leaderboard = await User.find().sort({xp : -1}).select("username xp rank")

        socket.emit("leaderboard-data" , {leaderboard , message: "leadedrboard loaded successfully"}) 
    }catch(err){
        console.log(err)
        socket.emit("error" , {message: "could not get leaderboard"})
    }
}

const getFriendLeaderboard = async(socket , socketUser) =>{
    try{
        const friends = await Frienship.find({
            $or: [
                {user1: socketUser._id},
                {user2: socketUser._id}
            ]
        }).populate("user2" , "username xp")
        
    }
}

module.exports = {getGlobalLeaderboard , getFriendLeaderboard}