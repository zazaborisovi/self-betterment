const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    task: {type: String , required: true},
    unit: {type: String , required: true , enum:["minutes" , "times" , "pages" , "hours" , "km" , "reps"]},
    category: {type: String , enum:["body" , "mind" , "soul" , "career"]},
    baseXp: {type: Number , default: 20},
    difficultyMultiplier: {type: Number , default: 1}
}, {timestamps: true})

const Task = mongoose.model("Task" , taskSchema)

module.exports = Task