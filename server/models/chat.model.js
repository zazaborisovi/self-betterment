const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    users:[{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    }]
}, {timestamps: true})

const Chat = mongoose.model("Chat" , chatSchema)

module.exports = Chat