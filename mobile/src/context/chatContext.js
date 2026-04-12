import { createContext, useContext, useState, useEffect } from "react"
import { useSocket } from "./socketContext"

const ChatContext = createContext()
export const useChat = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
    const { socket } = useSocket()

    const [chats, setChats] = useState([])
    const [messages, setMessages] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!socket) return
        socket.emit("get-chats")
    }, [socket])

    useEffect(() => {
        if (!socket) return

        const onChatsReceived = (data) => {
            setChats(data)
        }

        const onMessagesReceived = (data) => {
            setMessages(data)
            setLoading(false)
        }

        const onNewMessage = (newMessage) => {
            if (currentChat && newMessage.chatId === currentChat._id) {
                setMessages((prev) => [...prev, newMessage])
                socket.emit("mark-as-read", { chatId: currentChat._id })
            }

            setChats((prevChats) => {
                const existingChatIndex = prevChats.findIndex(c => c._id === newMessage.chatId)
                
                if (existingChatIndex !== -1) {
                    const updatedChats = [...prevChats]
                    const chatToUpdate = { 
                        ...updatedChats[existingChatIndex], 
                        lastMessage: newMessage 
                    }
                    updatedChats.splice(existingChatIndex, 1)
                    return [chatToUpdate, ...updatedChats]
                } else {
                    socket.emit("get-chats")
                    return prevChats
                }
            })
        }

        const onNotification = (data) => {
            setChats((prevChats) => {
                const existingChatIndex = prevChats.findIndex(c => c._id === data.chatId)
                if (existingChatIndex !== -1) {
                    const updatedChats = [...prevChats]
                    updatedChats[existingChatIndex].lastMessage = data
                    const chat = updatedChats.splice(existingChatIndex, 1)[0]
                    return [chat, ...updatedChats]
                } else {
                    socket.emit("get-chats")
                    return prevChats
                }
            })
        }

        socket.on("chats", onChatsReceived)
        socket.on("messages", onMessagesReceived)
        socket.on("message-received", onNewMessage)
        socket.on("message-notification", onNotification)

        return () => {
            socket.off("chats", onChatsReceived)
            socket.off("messages", onMessagesReceived)
            socket.off("message-received", onNewMessage)
            socket.off("message-notification", onNotification)
        }
    }, [socket, currentChat])

    const selectChat = (chat) => {
        if (currentChat?._id === chat._id) return
        
        setCurrentChat(chat)
        setMessages([])
        setLoading(true)
        
        socket.emit("join-chat", { chatId: chat._id })
        socket.emit("get-messages", { chatId: chat._id })
        socket.emit("mark-as-read", { chatId: chat._id })
    }

    const sendMessage = (receiverId, content) => {
        if (!socket || !content.trim()) return
        socket.emit("send-message", { receiverId, content })
    }

    const markAsRead = (chatId) => {
        if (!socket) return
        socket.emit("mark-as-read", { chatId })
    }

    return (
        <ChatContext.Provider value={{
            chats,
            messages,
            currentChat,
            loading,
            selectChat,
            sendMessage,
            markAsRead,
            setChats,
            setCurrentChat
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider