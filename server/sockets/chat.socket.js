const Chat = require("../models/chat.model")
const Message = require("../models/message.model")

const joinChat = async(socket , io , data) => {
    try {
        const {chatId} = data
        const chat = await Chat.findById(chatId
            .populate("users" , "name email")
            .populate("messages" , "content sender receiver")
        )

        if(!chat) return socket.emit("error" , "no chat found")
    
        socket.join(chatId)
        socket.emit("chat-joined", chat)
    } catch (err) {
        throw new Error(err.message)
    }
}

const sendMessage = async(socket , io , data) => {
    try{
        const {chatId , content} = data
        const userId = socketUser._.id

        const message = await Message.create({
            chatId,
            sender: userId,
            content
        })

        io.to(chatId).emit("message-sent" , message)

        await Chat.findByIdAndUpdate(chatId , {
            $push: {messages: message._id}
        })
    }catch(err){
        throw new Error(err.message)
    }
}

