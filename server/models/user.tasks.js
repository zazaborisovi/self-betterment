const mongoose = require("mongoose")

const userTasksSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    tasks: [{
        taskId: {type: mongoose.Types.ObjectId , ref: "Task"},
        isCompleted: {type: Boolean , default: false},
    }]
}, {timestamps: true})

const UserTasks = mongoose.model("UserTasks" , userTasksSchema)

module.exports = UserTasks