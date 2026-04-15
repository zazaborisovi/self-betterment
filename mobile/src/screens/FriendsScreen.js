import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, useColorScheme, Modal } from "react-native"
import { useAuth } from "../contexts/authContext"
import { useFriend } from "../contexts/friendContext"
import { useChat } from "../contexts/chatContext"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { UserX, MessageCircle, Inbox, ArrowDownLeft, ArrowUpRight } from "lucide-react-native"

const FriendsScreen = () => {
    const { user } = useAuth()
    const { friends, friendRequests, loading, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend } = useFriend()
    const { chats } = useChat()
    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'
    const styles = getStyles(isDark)

    const [activeTab, setActiveTab] = useState("friends")
    const [removalModal, setRemovalModal] = useState(null)

    const PendingIncoming = friendRequests?.filter(req => req.to?._id === user?._id || req.to === user?._id)
    const PendingOutgoing = friendRequests?.filter(req => req.from?._id === user?._id || req.from === user?._id)
    const requestCount = (PendingIncoming?.length || 0) + (PendingOutgoing?.length || 0)

    const handleMessageFriend = (friendId) => {
        const existingChat = chats.find(c => c.users.includes(friendId))
        if (existingChat) {
            navigation.navigate("chat", { screen: "ChatConversation", params: { chatId: existingChat._id } })
        } else {
            navigation.navigate("chat", { screen: "ChatConversation", params: { newFriendId: friendId } })
        }
    }

    const handleRemoveFriend = async () => {
        if (!removalModal) return
        await removeFriend(removalModal.friendshipId)
        setRemovalModal(null)
    }

    // ─── Friends Tab Content ───
    const renderFriendCard = ({ item: friendship }) => {
        const friend = friendship.user1._id === user?._id ? friendship.user2 : friendship.user1
        return (
            <View style={styles.friendCard}>
                <TouchableOpacity
                    style={styles.friendInfo}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate("profile", { userId: friend._id })}
                >
                    <LinearGradient
                        colors={['#3b82f6', '#6366f1']}
                        style={styles.avatar}
                    >
                        <Text style={styles.avatarText}>{friend.username?.charAt(0).toUpperCase()}</Text>
                    </LinearGradient>
                    <View style={styles.friendDetails}>
                        <Text style={styles.friendName} numberOfLines={1}>{friend.username}</Text>
                        <Text style={styles.friendRole}>Adventurer</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.friendActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        activeOpacity={0.7}
                        onPress={() => setRemovalModal({ friendshipId: friendship._id, username: friend.username })}
                    >
                        <UserX color={isDark ? '#64748b' : '#94a3b8'} size={18} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        activeOpacity={0.7}
                        onPress={() => handleMessageFriend(friend._id)}
                    >
                        <MessageCircle color={isDark ? '#818cf8' : '#6366f1'} size={18} />
                    </TouchableOpacity>
                    <View style={styles.rankSmall}>
                        <Text style={styles.rankSmallLabel}>RANK</Text>
                        <Text style={styles.rankSmallValue}>{friend.rank || 'F'}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const FriendsContent = () => (
        <FlatList
            data={friends}
            keyExtractor={(item) => item._id}
            renderItem={renderFriendCard}
            contentContainerStyle={styles.tabContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
                !loading && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No friends yet. Start competing to grow together!</Text>
                    </View>
                )
            )}
        />
    )

    // ─── Requests Tab Content ───
    const RequestsContent = () => {
        const hasNoRequests = (!PendingIncoming || PendingIncoming.length === 0) && (!PendingOutgoing || PendingOutgoing.length === 0)

        const allRequests = [
            ...(PendingIncoming?.length > 0 ? [{ type: 'header', label: 'INCOMING', key: 'h-incoming' }] : []),
            ...(PendingIncoming?.map(r => ({ ...r, type: 'incoming', key: r._id })) || []),
            ...(PendingOutgoing?.length > 0 ? [{ type: 'header', label: 'SENT', key: 'h-outgoing' }] : []),
            ...(PendingOutgoing?.map(r => ({ ...r, type: 'outgoing', key: r._id })) || []),
        ]

        if (hasNoRequests) {
            return (
                <View style={[styles.tabContent, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={styles.emptyState}>
                        <Inbox color={isDark ? '#334155' : '#cbd5e1'} size={36} />
                        <Text style={styles.emptyStateTextSmall}>No pending requests</Text>
                    </View>
                </View>
            )
        }

        return (
            <FlatList
                data={allRequests}
                keyExtractor={(item) => item.key}
                contentContainerStyle={styles.tabContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    if (item.type === 'header') {
                        return (
                            <View style={styles.requestHeaderRow}>
                                {item.label === 'INCOMING' ? (
                                    <ArrowDownLeft color="#22c55e" size={14} />
                                ) : (
                                    <ArrowUpRight color="#f59e0b" size={14} />
                                )}
                                <Text style={styles.requestGroupLabel}>{item.label}</Text>
                            </View>
                        )
                    }

                    if (item.type === 'incoming') {
                        return (
                            <View style={styles.requestCard}>
                                <View style={styles.requestInfo}>
                                    <LinearGradient colors={['#22c55e', '#16a34a']} style={styles.requestAvatar}>
                                        <Text style={styles.requestAvatarText}>{item.from?.username?.charAt(0).toUpperCase()}</Text>
                                    </LinearGradient>
                                    <Text style={styles.requestName}>{item.from?.username}</Text>
                                </View>
                                <View style={styles.requestButtons}>
                                    <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.8} onPress={() => acceptFriendRequest(item._id)}>
                                        <Text style={styles.acceptBtnText}>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8} onPress={() => rejectFriendRequest(item._id)}>
                                        <Text style={styles.rejectBtnText}>Reject</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }

                    // outgoing
                    return (
                        <View style={styles.requestCardOutgoing}>
                            <View style={styles.requestInfo}>
                                <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.requestAvatar}>
                                    <Text style={styles.requestAvatarText}>{item.to?.username?.charAt(0).toUpperCase()}</Text>
                                </LinearGradient>
                                <View>
                                    <Text style={styles.requestOutgoingLabel}>Sent to</Text>
                                    <Text style={styles.requestName}>{item.to?.username}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8} onPress={() => cancelFriendRequest(item._id)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        )
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Social Hub</Text>
                <Text style={styles.headerSubtitle}>Connect with fellow seekers</Text>
            </View>

            {/* add friend modal here */}

            {/* Tab Switcher */}
            <View style={styles.tabSwitcher}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
                    activeOpacity={0.8}
                    onPress={() => setActiveTab('friends')}
                >
                    {activeTab === 'friends' ? (
                        <LinearGradient
                            colors={['#6366f1', '#a855f7']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.tabGradient}
                        >
                            <Text style={styles.tabTextActive}>Friends</Text>
                            <View style={styles.countBadgeActive}>
                                <Text style={styles.countBadgeTextActive}>{friends?.length || 0}</Text>
                            </View>
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInner}>
                            <Text style={styles.tabText}>Friends</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countBadgeText}>{friends?.length || 0}</Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
                    activeOpacity={0.8}
                    onPress={() => setActiveTab('requests')}
                >
                    {activeTab === 'requests' ? (
                        <LinearGradient
                            colors={['#6366f1', '#a855f7']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.tabGradient}
                        >
                            <Text style={styles.tabTextActive}>Requests</Text>
                            {requestCount > 0 && (
                                <View style={styles.countBadgeActive}>
                                    <Text style={styles.countBadgeTextActive}>{requestCount}</Text>
                                </View>
                            )}
                        </LinearGradient>
                    ) : (
                        <View style={styles.tabInner}>
                            <Text style={styles.tabText}>Requests</Text>
                            {requestCount > 0 && (
                                <View style={[styles.countBadge, { backgroundColor: isDark ? 'rgba(239,68,68,0.2)' : '#fef2f2' }]}>
                                    <Text style={[styles.countBadgeText, { color: '#ef4444' }]}>{requestCount}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color="#a855f7" />
                </View>
            ) : (
                activeTab === 'friends' ? <FriendsContent /> : <RequestsContent />
            )}

            {/* Remove Friend Modal */}
            <Modal visible={!!removalModal} transparent animationType="fade" onRequestClose={() => setRemovalModal(null)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalIcon}>
                            <UserX color="#ef4444" size={32} />
                        </View>
                        <Text style={styles.modalTitle}>Remove Friend?</Text>
                        <Text style={styles.modalSubtitle}>
                            Are you sure you want to remove <Text style={styles.modalBoldName}>{removalModal?.username}</Text> from your friends list?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalRemoveBtn} activeOpacity={0.8} onPress={handleRemoveFriend}>
                                <Text style={styles.modalRemoveBtnText}>Yes, Remove</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalCancelBtn} activeOpacity={0.8} onPress={() => setRemovalModal(null)}>
                                <Text style={styles.modalCancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const getStyles = (isDark) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: isDark ? '#f8fafc' : '#0f172a',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
        color: isDark ? '#94a3b8' : '#64748b',
    },
    // Tab Switcher
    tabSwitcher: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        borderRadius: 18,
        padding: 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    tab: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
    },
    tabActive: {},
    tabGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 14,
        gap: 8,
    },
    tabInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    tabTextActive: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
    },
    tabText: {
        color: isDark ? '#64748b' : '#94a3b8',
        fontWeight: '700',
        fontSize: 15,
    },
    countBadgeActive: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    countBadgeTextActive: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 12,
    },
    countBadge: {
        backgroundColor: isDark ? '#0f172a' : '#e2e8f0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    countBadgeText: {
        color: isDark ? '#94a3b8' : '#64748b',
        fontWeight: '900',
        fontSize: 12,
    },
    // Tab Content
    tabContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    loadingWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Friend Cards
    friendCard: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    avatarText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 20,
    },
    friendDetails: {
        marginLeft: 14,
        flex: 1,
    },
    friendName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDark ? '#e2e8f0' : '#1e293b',
    },
    friendRole: {
        fontSize: 11,
        fontWeight: 'bold',
        color: isDark ? '#64748b' : '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    friendActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionButton: {
        width: 38,
        height: 38,
        borderRadius: 14,
        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    rankSmall: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    rankSmallLabel: {
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1,
        color: isDark ? '#64748b' : '#94a3b8',
    },
    rankSmallValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#f59e0b',
    },
    // Requests
    requestHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
        marginTop: 8,
        paddingLeft: 4,
    },
    requestGroupLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        color: isDark ? '#64748b' : '#94a3b8',
    },
    requestCard: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        marginBottom: 10,
    },
    requestCardOutgoing: {
        backgroundColor: isDark ? 'rgba(30,41,59,0.5)' : '#f8fafc',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        marginBottom: 10,
    },
    requestInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 12,
    },
    requestAvatar: {
        width: 40,
        height: 40,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    requestAvatarText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 16,
    },
    requestName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDark ? '#e2e8f0' : '#1e293b',
    },
    requestOutgoingLabel: {
        fontSize: 11,
        color: isDark ? '#64748b' : '#94a3b8',
        fontWeight: '600',
    },
    requestButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    acceptBtn: {
        flex: 1,
        paddingVertical: 11,
        backgroundColor: '#22c55e',
        borderRadius: 14,
        alignItems: 'center',
    },
    acceptBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    rejectBtn: {
        flex: 1,
        paddingVertical: 11,
        backgroundColor: isDark ? '#334155' : '#f1f5f9',
        borderRadius: 14,
        alignItems: 'center',
    },
    rejectBtnText: {
        color: isDark ? '#94a3b8' : '#64748b',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelBtn: {
        paddingVertical: 11,
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderRadius: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#e2e8f0',
    },
    cancelBtnText: {
        color: isDark ? '#94a3b8' : '#64748b',
        fontWeight: 'bold',
        fontSize: 14,
    },
    // Empty States
    emptyState: {
        paddingVertical: 48,
        paddingHorizontal: 24,
        borderRadius: 24,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: isDark ? '#334155' : '#cbd5e1',
        backgroundColor: isDark ? 'rgba(30,41,59,0.3)' : 'rgba(248,250,252,0.5)',
        alignItems: 'center',
    },
    emptyStateText: {
        color: isDark ? '#64748b' : '#94a3b8',
        fontSize: 15,
        textAlign: 'center',
    },
    emptyStateTextSmall: {
        color: isDark ? '#475569' : '#94a3b8',
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderRadius: 28,
        padding: 32,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        alignItems: 'center',
    },
    modalIcon: {
        width: 64,
        height: 64,
        borderRadius: 24,
        backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: isDark ? '#f8fafc' : '#0f172a',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 15,
        color: isDark ? '#94a3b8' : '#64748b',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 22,
    },
    modalBoldName: {
        fontWeight: 'bold',
        color: isDark ? '#e2e8f0' : '#1e293b',
    },
    modalButtons: {
        width: '100%',
        gap: 10,
    },
    modalRemoveBtn: {
        paddingVertical: 16,
        backgroundColor: '#ef4444',
        borderRadius: 18,
        alignItems: 'center',
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    modalRemoveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalCancelBtn: {
        paddingVertical: 16,
        backgroundColor: isDark ? '#334155' : '#f1f5f9',
        borderRadius: 18,
        alignItems: 'center',
    },
    modalCancelBtnText: {
        color: isDark ? '#e2e8f0' : '#475569',
        fontWeight: 'bold',
        fontSize: 16,
    },
})

export default FriendsScreen
