const User = require("../models/user.model")
const UserTasks = require("../models/user.tasks.model")

const setChoices = async(socket , socketUser , data) =>{
    try{
        const user = await User.findById(socketUser._id)

        console.log(user)

        if(!user) return socket.emit("error" , {message:"user not found"})
        
        user.choices = [...data]

        console.log(user.choices)
        await user.save()
        socket.emit("choices-set" , {message: "choices set successfully" , update: {
            choices: user.choices
        }})
    }catch(err){
        throw new Error(err)
    }
}

const getAllUsers = async(socket , socketUser) =>{
    try{
        const users = await User.find({_id: {$ne: socketUser._id}}).select("username email")
        socket.emit("users-data" , {message: "users found successfully" , update: {
            users
        }})
    }catch(err){
        throw new Error(err)
    }
}

const updateStreak = async(socket , socketUser) =>{
    try{
        const user =  await User.findById(socketUser._id)
        const taskObj = await UserTasks.findOne({userId: socketUser._id}).sort({createdAt: -1})

        if(!taskObj) return socket.emit("error" , {message: "no tasks found"})
        
        if(taskObj.tasks.every(t => t.isCompleted)){
            const today = new Date().toISOString().split("T")[0]
            let yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            yesterday = yesterday.toISOString().split("T")[0]
            let streakLastDate = user.streak.lastCompletedDate.toISOString().split("T")[0]

            if(streakLastDate !== yesterday && streakLastDate !== today){
                user.streak.currentStreak = 0
                if(user.streak.currentStreak > user.streak.longestStreak){
                    user.streak.longestStreak = user.streak.currentStreak
                }
            }else{
                user.streak.lastCompletedDate = today
                user.streak.currentStreak += 1
                if(user.streak.currentStreak > user.streak.longestStreak){
                    user.streak.longestStreak = user.streak.currentStreak
                }
            }
            console.log(yesterday , today , streakLastDate , user.streak)
            await user.save()
            socket.emit("streak-updated", {message: `your current streak is ${user.streak.currentStreak}` , update: {
                streak: user.streak
            }})
        }
    }catch(err){
        throw new Error(err)
    }
}

module.exports = {setChoices , updateStreak , getAllUsers}