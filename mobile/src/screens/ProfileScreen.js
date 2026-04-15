import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, useColorScheme, Platform } from "react-native"
import { useAuth } from "../contexts/authContext"
import { useUser } from "../contexts/userContext"
import { useFriend } from "../contexts/friendContext"
import { LinearGradient } from "expo-linear-gradient"
import { Dumbbell, Brain, Heart, UserPlus, CheckCircle2, Clock, LogOut } from "lucide-react-native"
import StatCard from "./components/StatCard"

const ProfileScreen = ({ route }) => {
    const { user: currentUser, signout } = useAuth()
    const { getUserProfile } = useUser()
    const { sendFriendRequest, friends, friendRequests } = useFriend()

    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'
    const styles = getStyles(isDark)

    const viewingUserId = route?.params?.userId
    const isSelf = !viewingUserId || viewingUserId === currentUser?._id

    const [profile, setProfile] = useState(isSelf ? currentUser : null)
    const [loading, setLoading] = useState(!isSelf)

    useEffect(() => {
        if (isSelf) {
            setProfile(currentUser)
            return
        }
        
        (async () => {
            setLoading(true)
            const data = await getUserProfile(viewingUserId)
            setProfile(data)
            setLoading(false)
        })()
    }, [viewingUserId, currentUser])

    const skills = profile?.skills || {
        body: { xp: { current: 0, max: 100 }, rank: "F" },
        mind: { xp: { current: 0, max: 100 }, rank: "F" },
        soul: { xp: { current: 0, max: 100 }, rank: "F" }
    }

    const isFriend = friends?.some(f => f.user1?._id === profile?._id || f.user2?._id === profile?._id)
    const isRequestPending = friendRequests?.some(r => r.from?._id === profile?._id || r.to?._id === profile?._id)

    const totalXpCurrent = profile?.xp?.current || 0
    const totalXpMax = profile?.xp?.max || 100
    const xpProgress = Math.min((totalXpCurrent / totalXpMax) * 100, 100)

    if (loading) {
        return (
            <View style={[styles.container, styles.centerAll]}>
                <ActivityIndicator size="large" color="#a855f7" />
                <Text style={styles.loadingText}>Loading Character...</Text>
            </View>
        )
    }

    if (!profile) {
        return (
            <View style={[styles.container, styles.centerAll]}>
                <Text style={styles.notFoundTitle}>User Not Found</Text>
                <Text style={styles.notFoundSub}>The character you are looking for does not exist.</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Character Sheet</Text>
            </View>

            {/* Identity Card */}
            <View style={styles.identityCard}>
                {/* Avatar */}
                <View style={styles.avatarWrapper}>
                    <LinearGradient
                        colors={['#6366f1', '#a855f7', '#ec4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.avatarGradient}
                    >
                        <View style={styles.avatarInner}>
                            <Text style={styles.avatarLetter}>
                                {profile.username?.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Name + Rank row */}
                <View style={styles.identityInfo}>
                    <View style={styles.nameSection}>
                        <Text style={styles.username}>{profile.username}</Text>
                        <Text style={styles.roleText}>Adventurer</Text>
                    </View>

                    <View style={styles.rankBadge}>
                        <Text style={styles.rankLabel}>OVERALL RANK</Text>
                        <Text style={styles.rankValue}>{profile.rank || 'F'}</Text>
                    </View>
                </View>

                {/* XP Progress */}
                <View style={styles.xpSection}>
                    <View style={styles.xpLabels}>
                        <Text style={styles.xpLabel}>TOTAL EXP</Text>
                        <Text style={styles.xpValue}>{totalXpCurrent} / {totalXpMax}</Text>
                    </View>
                    <View style={styles.xpBarBg}>
                        <LinearGradient
                            colors={['#a855f7', '#ec4899']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.xpBarFill, { width: `${xpProgress}%` }]}
                        />
                    </View>
                </View>

                {/* Friend Actions — only if viewing someone else */}
                {!isSelf && (
                    <View style={styles.actionRow}>
                        {isFriend ? (
                            <View style={styles.friendBadge}>
                                <CheckCircle2 color={isDark ? '#4ade80' : '#16a34a'} size={18} />
                                <Text style={styles.friendBadgeText}>Friends</Text>
                            </View>
                        ) : isRequestPending ? (
                            <View style={styles.pendingBadge}>
                                <Clock color="#f59e0b" size={18} />
                                <Text style={styles.pendingBadgeText}>Pending</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.addFriendButton}
                                activeOpacity={0.8}
                                onPress={() => sendFriendRequest(profile._id)}
                            >
                                <LinearGradient
                                    colors={['#9333ea', '#ec4899']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.addFriendGradient}
                                >
                                    <UserPlus color="#fff" size={18} />
                                    <Text style={styles.addFriendText}>Add Friend</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>

            {/* Skill Attributes */}
            <View style={styles.skillsSection}>
                <View style={styles.sectionTitleRow}>
                    <View style={styles.sectionAccent} />
                    <Text style={styles.sectionTitle}>Skill Attributes</Text>
                </View>

                <StatCard
                    title="Body"
                    xp={skills.body?.xp?.current || 0}
                    maxXp={skills.body?.xp?.max || 100}
                    rank={skills.body?.rank || 'F'}
                    gradientColors={['#22c55e', '#059669']}
                    icon={<Dumbbell color="#22c55e" size={16} />}
                />
                <StatCard
                    title="Mind"
                    xp={skills.mind?.xp?.current || 0}
                    maxXp={skills.mind?.xp?.max || 100}
                    rank={skills.mind?.rank || 'F'}
                    gradientColors={['#22d3ee', '#2563eb']}
                    icon={<Brain color="#22d3ee" size={16} />}
                />
                <StatCard
                    title="Soul"
                    xp={skills.soul?.xp?.current || 0}
                    maxXp={skills.soul?.xp?.max || 100}
                    rank={skills.soul?.rank || 'F'}
                    gradientColors={['#f472b6', '#e11d48']}
                    icon={<Heart color="#f472b6" size={16} />}
                />
            </View>

            {isSelf && (
                <TouchableOpacity
                    style={styles.signoutButton}
                    activeOpacity={0.8}
                    onPress={signout}
                >
                    <LogOut color="#ef4444" size={18} />
                    <Text style={styles.signoutText}>Sign Out</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    )
}

const getStyles = (isDark) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 20 : 20,
        paddingBottom: 40,
    },
    centerAll: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: isDark ? '#94a3b8' : '#64748b',
        fontWeight: 'bold',
    },
    notFoundTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: isDark ? '#f8fafc' : '#0f172a',
        marginBottom: 8,
    },
    notFoundSub: {
        fontSize: 15,
        color: isDark ? '#94a3b8' : '#64748b',
    },
    header: {
        alignItems: 'center',
        marginBottom: 28,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: '900',
        color: isDark ? '#f8fafc' : '#0f172a',
    },
    identityCard: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderRadius: 28,
        padding: 24,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        marginBottom: 28,
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.15 : 0.08,
        shadowRadius: 20,
        elevation: 6,
        alignItems: 'center',
    },
    avatarWrapper: {
        marginBottom: 20,
    },
    avatarGradient: {
        width: 110,
        height: 110,
        borderRadius: 55,
        padding: 3,
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 8,
    },
    avatarInner: {
        flex: 1,
        borderRadius: 52,
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarLetter: {
        fontSize: 44,
        fontWeight: '900',
        color: '#a855f7',
    },
    identityInfo: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    nameSection: {},
    username: {
        fontSize: 26,
        fontWeight: '900',
        color: isDark ? '#f8fafc' : '#0f172a',
    },
    roleText: {
        fontSize: 14,
        color: isDark ? '#94a3b8' : '#64748b',
        fontStyle: 'italic',
        marginTop: 2,
    },
    rankBadge: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    rankLabel: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
        color: isDark ? '#64748b' : '#94a3b8',
        marginBottom: 2,
    },
    rankValue: {
        fontSize: 34,
        fontWeight: '900',
        color: '#f59e0b',
    },
    xpSection: {
        width: '100%',
        marginBottom: 16,
    },
    xpLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    xpLabel: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        color: isDark ? '#64748b' : '#94a3b8',
    },
    xpValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDark ? '#e2e8f0' : '#334155',
    },
    xpBarBg: {
        height: 8,
        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    xpBarFill: {
        height: '100%',
        borderRadius: 6,
    },
    actionRow: {
        width: '100%',
        marginTop: 8,
    },
    addFriendButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    addFriendGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    addFriendText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    friendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: isDark ? 'rgba(22, 163, 74, 0.15)' : '#f0fdf4',
        borderWidth: 1,
        borderColor: isDark ? '#166534' : '#bbf7d0',
    },
    friendBadgeText: {
        color: isDark ? '#4ade80' : '#16a34a',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 8,
    },
    pendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb',
        borderWidth: 1,
        borderColor: isDark ? '#92400e' : '#fde68a',
    },
    pendingBadgeText: {
        color: '#f59e0b',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 8,
    },
    skillsSection: {
        marginBottom: 24,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionAccent: {
        width: 28,
        height: 4,
        borderRadius: 4,
        backgroundColor: '#a855f7',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: isDark ? '#f8fafc' : '#0f172a',
    },
    signoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
        borderWidth: 1,
        borderColor: isDark ? '#7f1d1d' : '#fecaca',
        marginBottom: 20,
    },
    signoutText: {
        color: '#ef4444',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
})

export default ProfileScreen
