const mongoose = require("mongoose")

const userTasksSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    tasks: [{
        task: String,
        quantity: Number,
        unit: {
            type: String,
            required: true,
            enum:["minutes" , "times" , "pages" , "hours" , "km" , "reps"]
        },
        xpValue: Number,
        category: {type: String , enum:["body" , "mind" , "soul"]},
        isCompleted: {type: Boolean , default: false},
    }],
    createdAt: {type: Date , default: Date.now()}
}, {timestamps: true})

const UserTasks = mongoose.model("UserTasks" , userTasksSchema)

module.exports = UserTasks