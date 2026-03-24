const mongoose = require("mongoose")

const friendshipSchema = new mongoose.Schema({
    user1:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    user2:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {timestamps: true})

const Friendship = mongoose.model("Friendship" , friendshipSchema)

module.exports = Friendship