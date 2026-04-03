const FriendRequest = require("../models/friend.request.model")
const Friendship = require("../models/friendship.model")
const User = require("../models/user.model")

const sendFriendRequest = async(io , socket , socketUser , data) =>{
    try{
        const {to} = data
        const from = socketUser._id
    
        const fromUser = await User.findById(from)
        const toUser = await User.findById(to)
    
        if(!fromUser || !toUser) return socket.emit("error" , {message:"User not found"})
        if(from.toString() === to.toString()) return socket.emit("error" , {message:"You can't send friend request to yourself"})
    
        if(await FriendRequest.findOne({$or: [{from,to}, {from:to,to:from}]})) return socket.emit("error" , {message:"Friend request already sent"})
        if(await Friendship.findOne({$or: [{user1:from,user2:to}, {user1:to,user2:from}]})) return socket.emit("error" , {message:"You are already friends"})
    
        const request = await FriendRequest.create({from,to})
        request.save()
    
        socket.emit("friend-request-sent" , {message: "Friend request sent successfully"})
        io.to(to.toString()).emit("friend-request" , {message: fromUser.username + " sent you a friend request"})
    }catch(err){
        console.log(err)
        socket.emit("error" , {message:"Something went wrong"})
    }
}

const acceptFriendRequest = async(io , socket , socketUser , data) =>{
    try{
        const {requestId} = data
        const userId = socketUser._id
        const user = await User.findById(userId)

        const request = await FriendRequest.findById(requestId)

        if(!request) return socket.emit("error" , {message:"Request not found"})
        if(request.to.toString() !== userId.toString()) return socket.emit("error" , {message:"Unauthorized"})


        await Promise.all([Friendship.create({user1:request.from,user2:request.to}) , request.deleteOne()])

        socket.emit("friend-request-accepted" , {message: "Friend request accepted"})
        io.to(request.from.toString()).emit("friend-request-accepted" , {message: user.username + " accepted your friend request"})
    }catch(err){
        console.log(err)
        socket.emit("error" , {message:"Something went wrong"})
    }
}

const rejectFriendRequest = async(io , socket , socketUser , data) => {
    try{
        const {requestId} = data
        const userId = socketUser._id

        const request = await FriendRequest.findById(requestId)
        if(!request) return socket.emit("error" , {message:"Request not found"})
        if(request.to.toString() !== userId.toString()) return socket.emit("error" , {message:"Unauthorized"})

        await request.deleteOne()
        socket.emit("friend-request-rejected" , {message: "friend request rejected successfully"})
    }catch(err){
        console.log(err)
        socket.emit("error" , {message:"Something went wrong"})
    }
}

const removeFriend = async(io , socket , socketUser , data) =>{
    try{
        const {friendshipId} = data
        const friendship = await Friendship.findById(friendshipId)

        if(!friendship) return socket.emit("error" , {message: "Friendship does not exist"})
        if(friendship.user1.toString() !== socketUser._id.toString() && friendship.user2.toString() !== socketUser._id.toString()) return socket.emit("error" , {message: "Unauthorized"})

        await friendship.deleteOne()
        socket.emit("friend-removed" , {message: "Friend removed successfully"})
    }catch(err){
        socket.emit("error" , {message: "Something went wrong"})
    }
}

module.exports = {sendFriendRequest , acceptFriendRequest , rejectFriendRequest , removeFriend}