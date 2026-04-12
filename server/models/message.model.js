const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    chatId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Chat"
    },
    sender:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiver:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    content:{
        type: String,
        required: true
    },
    isRead:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Message = mongoose.model("Message" , messageSchema)

module.exports = Message