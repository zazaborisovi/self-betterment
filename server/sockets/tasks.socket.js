const User = require("../models/user.model")
const UserTasks = require("../models/user.tasks.model")
const updateStreak = require("./user.socket")

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

module.exports = completeTask