const User = require("../models/user.model")

const getLeaderboard = async(io , socket) =>{
    try{
        const leaderboard = await User.find().sort({xp : -1}).select("username xp rank")

        socket.emit("leaderboard-data" , {leaderboard , message: "leadedrboard loaded successfully"}) 
    }catch(err){
        console.log(err)
        socket.emit("error" , {message: "could not get leaderboard"})
    }
}

module.exports = getLeaderboard