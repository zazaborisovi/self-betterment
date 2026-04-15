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

        if(!userTasks || recordDate != today){
            const choices = socketUser.choices?.length > 0 ? socketUser.choices : ["pushups"]
            const tasks = generateDailyTasks(socketUser.rank , choices)
            userTasks = await UserTasks.create({userId: socketUser._id , tasks})
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