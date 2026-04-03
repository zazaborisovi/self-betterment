const User = require("../models/user.model")
const UserTasks = require("../models/user.tasks.model")

const completeTask = async (socket , socketUser , data) =>{
    try{
        const {taskId} = data

        const user = await User.findById(socketUser._id)
        const taskObj = await UserTasks.findOne({userId: user._id})

        if(!user || !taskObj) return socket.emit("error" , {message:"User not found"})

        const task = taskObj.tasks.id(taskId)
        if(!task) return socket.emit("error" , {message:"Task not found"})

        task.isCompleted = !task.isCompleted
        user.xp = task.isCompleted ? user.xp + task.xpValue : user.xp - task.xpValue

        await Promise.all([user.save() , taskObj.save()])

        socket.emit("task-completed" , {taskObj})
    }catch(err){
        console.log(err)
        socket.emit("error" , {message:"Something went wrong"})
    }
}

module.exports = completeTask