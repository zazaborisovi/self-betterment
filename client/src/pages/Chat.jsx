import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams, useNavigate } from "react-router"
import { useChat } from "../contexts/chatContext"
import { useAuth } from "../contexts/authContext"
import { useUser } from "../contexts/userContext"

const Chat = () => {
    const { chatId } = useParams()
    const [searchParams] = useSearchParams()
    const newFriendId = searchParams.get("newFriendId")
    const navigate = useNavigate()

    const { chats, messages, currentChat, loading, selectChat, sendMessage, markAsRead, setCurrentChat } = useChat()
    const { user: currentUser } = useAuth()
    const { getUserProfile } = useUser()

    const [messageInput, setMessageInput] = useState("")
    const [newChatUser, setNewChatUser] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Handle chatId from params
    useEffect(() => {
        if (chatId) {
            const chat = chats.find(c => c._id === chatId)
            if (chat && currentChat?._id !== chatId) {
                selectChat(chat)
                setNewChatUser(null)
            }
        } else if (!newFriendId && currentChat) {
            setCurrentChat(null)
            setNewChatUser(null)
        }
    }, [chatId, chats, currentChat?._id, newFriendId])

    // Handle newFriendId from query params
    useEffect(() => {
        if (newFriendId && !chatId) {
            // Check if chat already exists for this friend
            const existingChat = chats.find(c => c.users.includes(newFriendId))
            if (existingChat) {
                navigate(`/chat/${existingChat._id}`, { replace: true })
            } else {
                (async () => {
                    const profile = await getUserProfile(newFriendId)
                    setNewChatUser(profile)
                    setCurrentChat(null)
                })()
            }
        }
    }, [newFriendId, chats])

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!messageInput.trim()) return

        const receiverId = currentChat ? currentChat.otherUser._id : newFriendId
        sendMessage(receiverId, messageInput)
        setMessageInput("")
    }

    const filteredChats = chats.filter(chat => 
        chat.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeUser = currentChat?.otherUser || newChatUser

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-slate-900 flex overflow-hidden transition-colors duration-300">
            {/* Sidebar */}
            <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 z-20 ${chatId || newFriendId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6">
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Messages</h1>
                    <div className="relative group">
                        <input 
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-purple-500/50 transition-all outline-hidden"
                        />
                        <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
                    {filteredChats.length === 0 && !searchQuery ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                            <p className="text-slate-400 text-sm font-medium italic">No active chats yet. Find friends to start chatting!</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredChats.map((chat) => (
                                <div 
                                    key={chat._id}
                                    onClick={() => navigate(`/chat/${chat._id}`)}
                                    className={`p-4 rounded-3xl cursor-pointer transition-all duration-300 flex items-center gap-4 group ${chatId === chat._id ? 'bg-purple-50 dark:bg-purple-500/10' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                                            {chat.otherUser.username.charAt(0).toUpperCase()}
                                        </div>
                                        {chat.lastMessage && !chat.lastMessage.isRead && chat.lastMessage.receiver === currentUser?._id && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h3 className={`font-bold truncate ${chatId === chat._id ? 'text-purple-600 dark:text-purple-400' : 'text-slate-800 dark:text-slate-200'}`}>
                                                {chat.otherUser.username}
                                            </h3>
                                            <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-tighter">
                                                {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${!chat.lastMessage?.isRead && chat.lastMessage?.receiver === currentUser?._id ? 'font-black text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                            {chat.lastMessage?.content || "Started a conversation"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 min-w-0 flex flex-col bg-white dark:bg-slate-900/50 relative overflow-x-hidden ${!chatId && !newFriendId ? 'hidden md:flex' : 'flex'}`}>
                {activeUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => navigate('/chat')} className="md:hidden p-2 -ml-2 text-slate-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                                    {activeUser.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-extrabold text-slate-800 dark:text-white leading-tight">{activeUser.username}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-purple-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, idx) => {
                                        const isMe = msg.sender === currentUser?._id
                                        return (
                                            <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`w-fit max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-3xl shadow-xs transition-all ${
                                                    isMe 
                                                    ? 'bg-linear-to-br from-purple-500 to-indigo-600 text-white rounded-tr-none' 
                                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                                }`}>
                                                    <p className="text-sm font-medium leading-relaxed break-all whitespace-pre-wrap">{msg.content}</p>
                                                    <p className={`text-[0.6rem] mt-1 font-bold uppercase tracking-tighter opacity-70 ${isMe ? 'text-right' : 'text-left'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {messages.length === 0 && !newChatUser && (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            </div>
                                            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Start the conversation</p>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
                                <div className="flex-1 relative">
                                    <input 
                                        type="text"
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        className="w-full px-6 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-purple-500/50 transition-all outline-hidden text-slate-800 dark:text-white"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className="p-3 bg-linear-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-linear-to-br from-purple-500/20 to-indigo-500/20 rounded-[2.5rem] blur-2xl absolute inset-0 animate-pulse"></div>
                            <div className="w-24 h-24 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] flex items-center justify-center text-purple-500 relative shadow-xl">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            </div>
                        </div>
                        <div className="max-w-xs space-y-2">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Seamless Connection</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Select a friend from the list or start a new conversation to begin your journey.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/friends')}
                            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                            Find Friends
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Chat