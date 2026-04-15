import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, useColorScheme, Platform, Dimensions } from "react-native"
import { useLeaderboard } from "../contexts/leaderboardContext"
import { useAuth } from "../contexts/authContext"
import { LinearGradient } from "expo-linear-gradient"
import { Trophy, Users, Star, Medal } from "lucide-react-native"

const { width } = Dimensions.get('window')

const LeaderboardScreen = ({ navigation }) => {
    const { user: currentUser } = useAuth()
    const { globalLeaderboard, friendLeaderboard, loading } = useLeaderboard()
    const [viewType, setViewType] = useState('global')

    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'
    const styles = getStyles(isDark)

    const leaderboardData = viewType === 'global' ? globalLeaderboard : friendLeaderboard

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.titleContainer}>
                <Trophy color="#fbbf24" size={40} style={{ marginBottom: 12 }} />
                <Text style={styles.headerTitle}>Hall of Fame</Text>
                <Text style={styles.headerSubtitle}>
                    {viewType === 'global' ? 'Global Rankings & Top Achievers' : 'Friend Circle Rankings'}
                </Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, viewType === 'global' ? styles.tabActive : styles.tabInactive]}
                    onPress={() => setViewType('global')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.tabText, viewType === 'global' ? styles.tabTextActive : styles.tabTextInactive]}>
                        Global
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, viewType === 'friends' ? styles.tabActive : styles.tabInactive]}
                    onPress={() => setViewType('friends')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.tabText, viewType === 'friends' ? styles.tabTextActive : styles.tabTextInactive]}>
                        Friends
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    const renderEmpty = () => {
        if (loading) return null
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                    {viewType === 'global' ? <Trophy color="#94a3b8" size={32} /> : <Users color="#94a3b8" size={32} />}
                </View>
                <Text style={styles.emptyTitle}>The Hall is Empty</Text>
                <Text style={styles.emptySubtitle}>
                    {viewType === 'global' 
                        ? 'No champions have risen yet. Start completing quests!' 
                        : 'You have no friends in the leaderboard yet. Send some requests!'}
                </Text>
            </View>
        )
    }

    const renderItem = ({ item, index }) => {
        const isTop3 = index < 3;
        const isCurrentUser = item._id === currentUser?._id;

        let rankStyle = styles.rankNormal;
        let rankBadgeStyle = styles.badgeNormal;
        let rankBadgeText = styles.badgeTextNormal;
        let rankTextColor = isDark ? '#f8fafc' : '#0f172a';
        let gradientColors = null

        if (index === 0) {
            rankStyle = styles.rankFirst;
            rankBadgeStyle = styles.badgeFirst;
            rankBadgeText = styles.badgeTextFirst;
            rankTextColor = '#fbbf24';
            gradientColors = ['rgba(251, 191, 36, 0.15)', 'rgba(217, 119, 6, 0.05)']
        } else if (index === 1) {
            rankStyle = styles.rankSecond;
            rankBadgeStyle = styles.badgeSecond;
            rankBadgeText = styles.badgeTextSecond;
            rankTextColor = '#94a3b8';
            gradientColors = ['rgba(148, 163, 184, 0.15)', 'rgba(71, 85, 105, 0.05)']
        } else if (index === 2) {
            rankStyle = styles.rankThird;
            rankBadgeStyle = styles.badgeThird;
            rankBadgeText = styles.badgeTextThird;
            rankTextColor = '#f59e0b';
            gradientColors = ['rgba(245, 158, 11, 0.15)', 'rgba(180, 83, 9, 0.05)']
        }

        return (
            <View style={[
                styles.userCard, 
                rankStyle, 
                isCurrentUser && styles.userCardCurrent
            ]}>
                {isTop3 && isDark && (
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFillObject}
                        borderRadius={24}
                    />
                )}
                
                <View style={styles.userCardInner}>
                    <View style={styles.leftSection}>
                        <View style={[styles.positionBadge, rankBadgeStyle]}>
                            {index === 0 ? <Medal color="#d97706" size={20} /> : <Text style={[styles.positionText, rankBadgeText]}>#{index + 1}</Text>}
                        </View>
                        <View>
                            <View style={styles.nameRow}>
                                <Text style={styles.usernameText} numberOfLines={1} onPress={() => navigation.navigate("profile", {userId: item._id})}>
                                    {item.username}
                                </Text>
                                {isCurrentUser && (
                                    <View style={styles.youBadge}>
                                        <Text style={styles.youBadgeText}>YOU</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.xpRow}>
                                <Star color="#a855f7" size={12} style={{ marginRight: 4 }} />
                                <Text style={styles.xpText}>{item.xp?.current || 0} EXP</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.rightSection}>
                        <Text style={styles.rankLabel}>RANK</Text>
                        <Text style={[styles.rankValue, { color: rankTextColor }]}>{item.rank || 'F'}</Text>
                    </View>
                </View>
            </View>
        )
    }

    if (loading && !leaderboardData) {
        return (
            <View style={[styles.container, styles.centerAll]}>
                <ActivityIndicator size="large" color="#f59e0b" />
                <Text style={styles.loadingText}>Fetching Champions...</Text>
            </View> 
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={leaderboardData}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const getStyles = (isDark) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 38,
        fontWeight: '900',
        color: isDark ? '#f8fafc' : '#0f172a',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: isDark ? '#94a3b8' : '#64748b',
        fontWeight: '500',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : '#e2e8f0',
        borderRadius: 16,
        padding: 4,
        width: '100%',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#cbd5e1',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    tabActive: {
        backgroundColor: isDark ? '#334155' : '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabInactive: {
        backgroundColor: 'transparent',
    },
    tabText: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    tabTextActive: {
        color: '#f59e0b',
    },
    tabTextInactive: {
        color: isDark ? '#64748b' : '#94a3b8',
    },
    userCard: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderRadius: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        position: 'relative',
        overflow: 'hidden',
    },
    userCardCurrent: {
        borderColor: '#f59e0b',
        borderWidth: 2,
        transform: [{ scale: 1.01 }],
    },
    rankFirst: {
        borderColor: isDark ? 'rgba(251, 191, 36, 0.5)' : '#fde68a',
    },
    rankSecond: {
        borderColor: isDark ? 'rgba(148, 163, 184, 0.5)' : '#e2e8f0',
    },
    rankThird: {
        borderColor: isDark ? 'rgba(217, 119, 6, 0.5)' : '#fed7aa',
    },
    userCardInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    positionBadge: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    badgeNormal: {
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f1f5f9',
    },
    badgeFirst: {
        backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : '#fef3c7',
    },
    badgeSecond: {
        backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : '#f8fafc',
    },
    badgeThird: {
        backgroundColor: isDark ? 'rgba(217, 119, 6, 0.2)' : '#fff7ed',
    },
    positionText: {
        fontSize: 18,
        fontWeight: '900',
    },
    badgeTextNormal: {
        color: isDark ? '#64748b' : '#94a3b8',
    },
    badgeTextFirst: {
        color: '#d97706',
    },
    badgeTextSecond: {
        color: '#64748b',
    },
    badgeTextThird: {
        color: '#b45309',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    usernameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: isDark ? '#f8fafc' : '#0f172a',
        maxWidth: 150,
    },
    youBadge: {
        backgroundColor: '#f59e0b',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    youBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    xpRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    xpText: {
        fontSize: 13,
        fontWeight: '600',
        color: isDark ? '#94a3b8' : '#64748b',
        letterSpacing: 0.5,
    },
    rightSection: {
        alignItems: 'center',
    },
    rankLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: isDark ? '#64748b' : '#94a3b8',
        marginBottom: 2,
        letterSpacing: 1,
    },
    rankValue: {
        fontSize: 32,
        fontWeight: '900',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderRadius: 32,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        marginTop: 20,
    },
    emptyIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: isDark ? '#f8fafc' : '#0f172a',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        color: isDark ? '#94a3b8' : '#64748b',
        textAlign: 'center',
        lineHeight: 22,
    }
})

export default LeaderboardScreen
