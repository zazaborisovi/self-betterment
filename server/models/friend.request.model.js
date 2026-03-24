const mongoose = require("mongoose")

const friendRequestSchema = new mongoose.Schema({
    from:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    to:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

const FriendRequest = mongoose.model("FriendRequest" , friendRequestSchema)

module.exports = FriendRequest