const Chat = require("../models/chat.model")
const Message = require("../models/message.model")
const User = require("../models/user.model")

const sendMessage = async (io, socket, socketUser, data) => {
    try {
        const { receiverId, content } = data
        const senderId = socketUser._id

        let chat = await Chat.findOne({ users: { $all: [senderId, receiverId] } })

        if (!chat) {
            chat = await Chat.create({
                users: [senderId, receiverId]
            })
        }

        const message = await Message.create({
            chatId: chat._id,
            sender: senderId,
            receiver: receiverId,
            content
        })

        socket.join(chat._id.toString())

        io.to(chat._id.toString()).emit("message-received", message)

        io.to(receiverId.toString()).emit("message-notification", {
            ...message._doc,
            senderName: socketUser.username
        })
        
    } catch (err) {
        throw new Error(err.message)
    }
}

const getChats = async (socket, socketUser) => {
    try {
        const chats = await Chat.find({ users: socketUser._id }).lean()

        const chatsWithDetails = await Promise.all(chats.map(async (chat) => {
            const otherUserId = chat.users.find(id => id.toString() !== socketUser._id.toString())
            
            const [otherUser, lastMessage] = await Promise.all([
                User.findById(otherUserId).select("username rank xp"),
                Message.findOne({ chatId: chat._id }).sort({ createdAt: -1 }).lean()
            ])

            return {
                ...chat,
                otherUser,
                lastMessage
            }
        }))

        chatsWithDetails.sort((a, b) => {
            const timeA = a.lastMessage?.createdAt || a.createdAt
            const timeB = b.lastMessage?.createdAt || b.createdAt
            return new Date(timeB) - new Date(timeA)
        })

        socket.emit("chats", chatsWithDetails)
    } catch (err) {
        throw new Error(err.message)
    }
}

const getMessages = async (socket, socketUser, data) => {
    try {
        const { chatId } = data
        const chat = await Chat.findById(chatId)

        if (!chat) return socket.emit("error", { message: "Chat not found" })

        const isMember = chat.users.some(id => id.toString() === socketUser._id.toString())
        if (!isMember) return socket.emit("error", { message: "Unauthorized access to chat" })

        const messages = await Message.find({ chatId })
            .sort({ createdAt: 1 })
            .limit(100)
            .lean()

        socket.emit("messages", messages)
    } catch (err) {
        throw new Error(err.message)
    }
}

const joinChat = async (socket, socketUser, data) => {
    try {
        const { chatId } = data
        const chat = await Chat.findById(chatId)

        if (!chat) return

        const isMember = chat.users.some(id => id.toString() === socketUser._id.toString())
        if (!isMember) return socket.emit("error", { message: "Unauthorized" })

        socket.join(chatId.toString())
    } catch (err) {
        throw new Error(err.message)
    }
}

const markAsRead = async (socket, socketUser, data) => {
    try {
        const { chatId } = data
        
        await Message.updateMany(
            { chatId, receiver: socketUser._id, isRead: false },
            { $set: { isRead: true } }
        )

        socket.emit("messages-read", { chatId })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = { sendMessage, getChats, getMessages, joinChat, markAsRead }
