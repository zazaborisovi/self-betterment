import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, useColorScheme, ActivityIndicator } from "react-native"
import { useChat } from "../contexts/chatContext"
import { useAuth } from "../contexts/authContext"
import { useUser } from "../contexts/userContext"
import { LinearGradient } from "expo-linear-gradient"
import { ChevronLeft, Send, Search, MessageSquare } from "lucide-react-native"

const ChatScreen = ({ route, navigation }) => {
    const { chatId, newFriendId } = route?.params || {}
    const { chats, messages, currentChat, loading, selectChat, sendMessage, setCurrentChat } = useChat()
    const { user: currentUser } = useAuth()
    const { getUserProfile } = useUser()

    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'
    const styles = getStyles(isDark)

    const [messageInput, setMessageInput] = useState("")
    const [newChatUser, setNewChatUser] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const flatListRef = useRef(null)

    // If chatId is passed, select that chat
    useEffect(() => {
        if (chatId) {
            const chat = chats.find(c => c._id === chatId)
            if (chat && currentChat?._id !== chatId) {
                selectChat(chat)
                setNewChatUser(null)
            }
        }
    }, [chatId, chats])

    // If newFriendId is passed, load the friend's profile for a new conversation
    useEffect(() => {
        if (newFriendId && !chatId) {
            const existingChat = chats.find(c => c.users.includes(newFriendId))
            if (existingChat) {
                selectChat(existingChat)
            } else {
                (async () => {
                    const profile = await getUserProfile(newFriendId)
                    setNewChatUser(profile)
                    setCurrentChat(null)
                })()
            }
        }
    }, [newFriendId, chats])

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true })
            }, 100)
        }
    }, [messages])

    // Clean up on unmount
    useEffect(() => {
        return () => {
            setCurrentChat(null)
        }
    }, [])

    const handleSend = () => {
        if (!messageInput.trim()) return
        const receiverId = currentChat ? currentChat.otherUser._id : newFriendId
        sendMessage(receiverId, messageInput)
        setMessageInput("")
    }

    const filteredChats = chats.filter(chat =>
        chat.otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeUser = currentChat?.otherUser || newChatUser

    // If we have a specific chat open (chatId or newFriendId), show chat view
    if (chatId || newFriendId || activeUser) {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                {/* Chat Header */}
                <View style={styles.chatHeader}>
                    <TouchableOpacity
                        style={styles.backButton}
                        activeOpacity={0.7}
                        onPress={() => navigation.goBack()}
                    >
                        <ChevronLeft color={isDark ? '#94a3b8' : '#64748b'} size={24} />
                    </TouchableOpacity>
                    <LinearGradient
                        colors={['#a855f7', '#6366f1']}
                        style={styles.chatAvatar}
                    >
                        <Text style={styles.chatAvatarText}>
                            {activeUser?.username?.charAt(0).toUpperCase() || '?'}
                        </Text>
                    </LinearGradient>
                    <View style={styles.chatHeaderInfo}>
                        <Text style={styles.chatHeaderName}>{activeUser?.username || 'Chat'}</Text>
                        <View style={styles.onlineRow}>
                            <View style={styles.onlineDot} />
                            <Text style={styles.onlineText}>ONLINE</Text>
                        </View>
                    </View>
                </View>

                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item, idx) => item._id || `msg-${idx}`}
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                    ListEmptyComponent={() => (
                        !loading && (
                            <View style={styles.emptyMessages}>
                                <View style={styles.emptyMessagesIcon}>
                                    <MessageSquare color={isDark ? '#475569' : '#cbd5e1'} size={32} />
                                </View>
                                <Text style={styles.emptyMessagesText}>START THE CONVERSATION</Text>
                            </View>
                        )
                    )}
                    renderItem={({ item: msg }) => {
                        const isMe = msg.sender === currentUser?._id
                        return (
                            <View style={[styles.messageRow, isMe ? styles.messageRowRight : styles.messageRowLeft]}>
                                {isMe ? (
                                    <LinearGradient
                                        colors={['#a855f7', '#6366f1']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={[styles.messageBubble, styles.messageBubbleMe]}
                                    >
                                        <Text style={styles.messageTextMe}>{msg.content}</Text>
                                        <Text style={styles.messageTimeMe}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={[styles.messageBubble, styles.messageBubbleOther]}>
                                        <Text style={styles.messageTextOther}>{msg.content}</Text>
                                        <Text style={styles.messageTimeOther}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )
                    }}
                />

                {loading && (
                    <View style={styles.loadingBar}>
                        <ActivityIndicator size="small" color="#a855f7" />
                    </View>
                )}

                {/* Input */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message..."
                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                        value={messageInput}
                        onChangeText={setMessageInput}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !messageInput.trim() && styles.sendButtonDisabled]}
                        activeOpacity={0.8}
                        onPress={handleSend}
                        disabled={!messageInput.trim()}
                    >
                        <LinearGradient
                            colors={messageInput.trim() ? ['#a855f7', '#6366f1'] : [isDark ? '#334155' : '#e2e8f0', isDark ? '#334155' : '#e2e8f0']}
                            style={styles.sendButtonGradient}
                        >
                            <Send color={messageInput.trim() ? '#fff' : (isDark ? '#64748b' : '#94a3b8')} size={20} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }

    // Chat list view (no specific chat selected)
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Messages</Text>
                <View style={styles.searchContainer}>
                    <Search color={isDark ? '#64748b' : '#94a3b8'} size={18} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search conversations..."
                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={filteredChats}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.chatListContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyChatList}>
                        <MessageSquare color={isDark ? '#334155' : '#cbd5e1'} size={40} />
                        <Text style={styles.emptyChatListText}>No active chats yet. Find friends to start chatting!</Text>
                    </View>
                )}
                renderItem={({ item: chat }) => {
                    const unread = chat.lastMessage && !chat.lastMessage.isRead && chat.lastMessage.receiver === currentUser?._id
                    return (
                        <TouchableOpacity
                            style={styles.chatItem}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate("ChatConversation", { chatId: chat._id })}
                        >
                            <View style={styles.chatItemAvatarWrap}>
                                <LinearGradient
                                    colors={['#a855f7', '#6366f1']}
                                    style={styles.chatItemAvatar}
                                >
                                    <Text style={styles.chatItemAvatarText}>
                                        {chat.otherUser?.username?.charAt(0).toUpperCase()}
                                    </Text>
                                </LinearGradient>
                                {unread && <View style={styles.unreadDot} />}
                            </View>
                            <View style={styles.chatItemDetails}>
                                <View style={styles.chatItemTop}>
                                    <Text style={[styles.chatItemName, unread && styles.chatItemNameUnread]} numberOfLines={1}>
                                        {chat.otherUser?.username}
                                    </Text>
                                    <Text style={styles.chatItemTime}>
                                        {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </Text>
                                </View>
                                <Text style={[styles.chatItemPreview, unread && styles.chatItemPreviewUnread]} numberOfLines={1}>
                                    {chat.lastMessage?.content || "Started a conversation"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

const getStyles = (isDark) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    // Chat List
    listHeader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    listTitle: {
        fontSize: 30,
        fontWeight: '900',
        color: isDark ? '#f8fafc' : '#0f172a',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: isDark ? '#f8fafc' : '#0f172a',
        fontSize: 15,
    },
    chatListContent: {
        paddingHorizontal: 12,
        paddingBottom: 30,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 24,
        marginBottom: 4,
    },
    chatItemAvatarWrap: {
        position: 'relative',
    },
    chatItemAvatar: {
        width: 50,
        height: 50,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    chatItemAvatarText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 20,
    },
    unreadDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#ef4444',
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#f8fafc',
    },
    chatItemDetails: {
        flex: 1,
        marginLeft: 14,
    },
    chatItemTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDark ? '#e2e8f0' : '#1e293b',
        flex: 1,
    },
    chatItemNameUnread: {
        color: isDark ? '#f8fafc' : '#0f172a',
        fontWeight: '900',
    },
    chatItemTime: {
        fontSize: 11,
        fontWeight: 'bold',
        color: isDark ? '#64748b' : '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: -0.5,
    },
    chatItemPreview: {
        fontSize: 13,
        color: isDark ? '#64748b' : '#94a3b8',
    },
    chatItemPreviewUnread: {
        color: isDark ? '#f1f5f9' : '#0f172a',
        fontWeight: '900',
    },
    emptyChatList: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    emptyChatListText: {
        color: isDark ? '#475569' : '#94a3b8',
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 12,
    },
    // Chat Conversation
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#1e293b' : '#e2e8f0',
        backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    chatAvatar: {
        width: 44,
        height: 44,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    chatAvatarText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 18,
    },
    chatHeaderInfo: {
        marginLeft: 12,
    },
    chatHeaderName: {
        fontSize: 17,
        fontWeight: '900',
        color: isDark ? '#f8fafc' : '#0f172a',
    },
    onlineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    onlineDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#22c55e',
        marginRight: 6,
    },
    onlineText: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1.5,
        color: isDark ? '#64748b' : '#94a3b8',
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    messageRow: {
        marginBottom: 8,
    },
    messageRowRight: {
        alignItems: 'flex-end',
    },
    messageRowLeft: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
    },
    messageBubbleMe: {
        borderBottomRightRadius: 6,
    },
    messageBubbleOther: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderBottomLeftRadius: 6,
    },
    messageTextMe: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
    },
    messageTextOther: {
        color: isDark ? '#e2e8f0' : '#1e293b',
        fontSize: 15,
        lineHeight: 22,
    },
    messageTimeMe: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 4,
        letterSpacing: -0.5,
    },
    messageTimeOther: {
        color: isDark ? '#64748b' : '#94a3b8',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
        letterSpacing: -0.5,
    },
    emptyMessages: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        opacity: 0.5,
    },
    emptyMessagesIcon: {
        width: 64,
        height: 64,
        borderRadius: 24,
        backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    emptyMessagesText: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
        color: isDark ? '#64748b' : '#94a3b8',
    },
    loadingBar: {
        padding: 8,
        alignItems: 'center',
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 28 : 12,
        borderTopWidth: 1,
        borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        gap: 10,
    },
    textInput: {
        flex: 1,
        backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 15,
        color: isDark ? '#f8fafc' : '#0f172a',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    sendButton: {
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
    },
    sendButtonDisabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    sendButtonGradient: {
        width: 46,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default ChatScreen
