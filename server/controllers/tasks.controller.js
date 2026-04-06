const UserTasks = require("../models/user.tasks.model")
const User = require("../models/user.model")
const generateDailyTasks = require("../utils/dailyTaskGenerator")

const getTasks = async (req , res) =>{
    try{
        const userTasks = await UserTasks.findOne({userId: req.user._id}).sort({createdAt: -1})

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

module.exports = {getTasks , dailyTasks}