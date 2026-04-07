const Friendship = require("../models/friendship.model")
const User = require("../models/user.model")

const getGlobalLeaderboard = async(socket) =>{
    try{
        const leaderboard = await User.find().sort({xp : -1}).select("username xp rank")

        socket.emit("global-leaderboard-data" , {leaderboard , message: "leadedrboard loaded successfully"}) 
    }catch(err){
        console.log(err)
        socket.emit("error" , {message: "could not get leaderboard"})
    }
}

const getFriendLeaderboard = async(socket , socketUser) =>{
    try{
        const userId = socketUser._id.toString()
        const friendships = await Friendship.find({
            $or: [
                {user1: socketUser._id},
                {user2: socketUser._id}
            ]
        }).populate("user1" , "username xp rank").populate("user2" , "username xp rank")
        
        // Extract all unique users from friendships
        const userMap = new Map()
        
        // Add the current user first
        const currentUser = await User.findById(userId).select("username xp rank")
        if (currentUser) {
            userMap.set(userId, currentUser)
        }

        // Add each friend to the map
        friendships.forEach(f => {
            const u1 = f.user1
            const u2 = f.user2
            
            if (u1 && u1._id.toString() !== userId) userMap.set(u1._id.toString(), u1)
            if (u2 && u2._id.toString() !== userId) userMap.set(u2._id.toString(), u2)
        })

        // Convert map to array and sort by XP
        const leaderboard = Array.from(userMap.values())
            .sort((a, b) => (b.xp || 0) - (a.xp || 0))
        
        socket.emit("friend-leaderboard-data" , {leaderboard, message: "friend leaderboard loaded successfully"})
    }catch(err){
        console.log(err)
        socket.emit("error" , {message: "could not get leaderboard"})
    }
}

module.exports = {getGlobalLeaderboard , getFriendLeaderboard}