const User = require("../models/user.model")
const UserTasks = require("../models/user.tasks.model")
const { updateStreak } = require("./user.socket")
const generateDailyTasks = require("../utils/dailyTaskGenerator")

const getTasks = async (socket , socketUser) =>{
    try{
        let userTasks = await UserTasks.findOne({userId: socketUser._id}).sort({createdAt: -1})

        let recordDate = null
        let today = null

        if(userTasks){
            recordDate = new Date(userTasks?.createdAt).toISOString().split('T')[0]
            today = new Date().toISOString().split('T')[0]
        }

        const user = await User.findById(socketUser._id)
        if(!user) return socket.emit("error" , {message: "User not found"})

        // Check for streak reset
        const todayStr = new Date().toISOString().split("T")[0]
        let yesterdayDate = new Date()
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)
        const yesterdayStr = yesterdayDate.toISOString().split("T")[0]
        const lastDateStr = user.streak.lastCompletedDate ? new Date(user.streak.lastCompletedDate).toISOString().split("T")[0] : null

        if (lastDateStr && lastDateStr !== todayStr && lastDateStr !== yesterdayStr) {
            if (user.streak.currentStreak > 0) {
                user.streak.currentStreak = 0
                await user.save()
            }
        }

        if(!userTasks || recordDate != today || userTasks.tasks.length === 0){
            if(user.choices && user.choices.length > 0) {
                const tasks = generateDailyTasks(user.rank , user.choices)
                
                if (userTasks && recordDate == today) {
                    userTasks.tasks = tasks
                    await userTasks.save()
                } else {
                    userTasks = await UserTasks.create({userId: socketUser._id , tasks})
                }
            }
        }

        socket.emit("tasks" , {taskObj: userTasks})
    }catch(err){
        throw new Error(err)
    }
}

const completeTask = async (socket , socketUser , data) =>{
    try{
        const {taskId} = data

        const user = await User.findById(socketUser._id)
        const taskObj = await UserTasks.findOne({userId: user._id}).sort({createdAt: -1})

        if(!user || !taskObj) return socket.emit("error" , {message:"User not found"})

        const task = taskObj.tasks.id(taskId)
        if(!task) return socket.emit("error" , {message:"Task not found"})

        const taskCategory = task.category
            
        task.isCompleted = !task.isCompleted
        user.xp.current += task.isCompleted ? task.xpValue : -task.xpValue

        user.skills[taskCategory].xp.current += task.isCompleted ? task.xpValue : -task.xpValue

        updateStreak(socket , socketUser)

        await Promise.all([user.save() , taskObj.save()])

        socket.emit("task-completed" , {taskObj , update:{
            xp: user.xp,
            skills: user.skills,
            rank: user.rank,
            streak: user.streak,
        }})
    }catch(err){
        throw new Error(err)
    }
}

module.exports = {completeTask , getTasks}