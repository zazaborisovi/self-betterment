const User = require("../models/user.model")
const UserTasks = require("../models/user.tasks.model")
const generateDailyTasks = require("../utils/dailyTaskGenerator")

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

        // Trigger task generation right after choices are set if they are currently empty
        let userTasks = await UserTasks.findOne({userId: socketUser._id}).sort({createdAt: -1})
        const today = new Date().toISOString().split('T')[0]
        const recordDate = userTasks ? new Date(userTasks.createdAt).toISOString().split('T')[0] : null

        if(!userTasks || recordDate !== today || userTasks.tasks.length === 0){
            const tasks = generateDailyTasks(user.rank , user.choices)
            if(userTasks && recordDate === today){
                userTasks.tasks = tasks
                await userTasks.save()
            }else{
                userTasks = await UserTasks.create({userId: socketUser._id , tasks})
            }
            socket.emit("tasks" , {taskObj: userTasks})
        }
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
        
        // Only increment if EVERY task is completed
        if(taskObj.tasks.every(t => t.isCompleted)){
            const today = new Date().toISOString().split("T")[0]
            
            // Get yesterday as a string
            let yesterdayDate = new Date()
            yesterdayDate.setDate(yesterdayDate.getDate() - 1)
            const yesterday = yesterdayDate.toISOString().split("T")[0]
            
            // Get last completed date as a string
            const lastDate = user.streak.lastCompletedDate ? new Date(user.streak.lastCompletedDate).toISOString().split("T")[0] : null

            if (lastDate === today) {
                // Already completed all tasks today, don't increment again
                return
            }

            if (lastDate === yesterday) {
                // Finished yesterday, increment streak
                user.streak.currentStreak += 1
            } else {
                // Missed a day (or brand new), start/restart at 1
                user.streak.currentStreak = 1
            }

            // Update longest streak if necessary
            if (user.streak.currentStreak > user.streak.longestStreak) {
                user.streak.longestStreak = user.streak.currentStreak
            }

            user.streak.lastCompletedDate = new Date()
            await user.save()

            socket.emit("streak-updated", {
                message: `Quest Perfected! Current streak: ${user.streak.currentStreak} 🔥`, 
                update: { streak: user.streak }
            })
        }
    }catch(err){
        console.error("Streak Error:", err)
        throw new Error(err)
    }
}

module.exports = {setChoices , updateStreak , getAllUsers}