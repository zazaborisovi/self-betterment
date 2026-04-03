const UserTasks = require("../models/user.tasks.model")
const User = require("../models/user.model")
const generateDailyTasks = require("../utils/dailyTaskGenerator")

const getTasks = async (req , res) =>{
    try{
        const userTasks = await UserTasks.findOne({userId: req.user._id})

        if(!userTasks) return res.status(404).json({message: "No tasks found" , success: false})

        res.status(200).json({taskObj: userTasks , success: true})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const dailyTasks = async (req , res) =>{
    try{
        const userTasks = generateDailyTasks(req.user.rank , req.user.choices)

        const newTasks = await UserTasks.create({userId: req.user._id , tasks: userTasks})

        res.status(201).json({taskObj: newTasks , message: "Daily tasks generated successfully"})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const completeTask = async (req , res) =>{
    try{
        const taskId = req.params.id
        
        const user = await User.findById(req.user._id)
        const userTasks = await UserTasks.findOne({userId: req.user._id})

        if(!userTasks) return res.status(404).json({message: "No tasks found for user"})
        
        const task = userTasks.tasks.id(taskId)

        if(!task) return res.status(404).json({message: "Task not found"})
        if(task.isCompleted) return res.status(400).json({message: "Task already completed"})

        task.isCompleted = !task.isCompleted
        user.xp += task.xpValue

        await Promise.all([user.save(), userTasks.save()])

        res.status(200).json({message: "Task completed", currentXp: user.xp , currentRank: user.rank})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

module.exports = {getTasks , dailyTasks , completeTask}