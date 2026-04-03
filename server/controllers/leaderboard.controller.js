const User = require("../models/user.model")

const getLeaderboard = async(req , res) =>{
    try{
        const leaderboard = await User.find().sort({xp : -1}).select("username xp rank")
        
        return res.status(200).json({leaderboard})
    }catch(err){
        return res.status(500).json({message : err.message})
    }
}

module.exports = {getLeaderboard}