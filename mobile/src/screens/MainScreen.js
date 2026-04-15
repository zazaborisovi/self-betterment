import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ActivityIndicator, useColorScheme } from "react-native"
import { useAuth } from "../contexts/authContext"
import { LinearGradient } from "expo-linear-gradient"
import { CheckCircle2, Circle, Flame, Brain, Dumbbell } from "lucide-react-native"
import { useTask } from "../contexts/taskContext"
import ChoicesModal from "./components/ChoicesModal"

const { width } = Dimensions.get('window')

const MainScreen = () => {
    const { user } = useAuth()
    const { tasks, completeTask, loading } = useTask()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'
    const styles = getStyles(isDark)
    const [showChoices, setShowChoices] = useState(false)

    const progress = user?.xp ? ((user.xp.current / user.xp.max) * 100).toFixed(0) : 45
    const currentRank = user?.rank || "F"
    
    const nextRankMap = { "F": "D", "D": "C", "C": "B", "B": "A", "A": "S", "S": "S+", "S+": "MAX" }
    const nextRank = nextRankMap[currentRank] || "???"

    const toggleTask = (id) => {
        completeTask(id)
    }

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerTextContainer}>
                <Text style={styles.title}>Daily Quests</Text>
                <Text style={styles.subtitle}>Complete your objectives to level up</Text>
            </View>

            <View style={styles.progressCard}>
                <View style={styles.progressInfo}>
                    <Text style={styles.rankText}>RANK {currentRank} → {nextRank}</Text>
                    <Text style={styles.progressPercent}>{progress}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <LinearGradient
                        colors={['#4f46e5', '#9333ea', '#3b82f6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${progress}%` }]}
                    />
                </View>
            </View>

            <TouchableOpacity 
                style={styles.choicesButton}
                activeOpacity={0.8}
                onPress={() => setShowChoices(true)}
            >
                <LinearGradient
                    colors={isDark ? ['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.9)'] : ['#f1f5f9', '#e2e8f0']}
                    style={styles.choicesButtonBg}
                >
                    <Dumbbell color="#a855f7" size={18} />
                    <Text style={styles.choicesButtonText}>Manage Daily Choices</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )

    const renderItem = ({ item }) => {
        const getCategoryIcon = () => {
            switch(item.category) {
                case 'body': return <Dumbbell size={16} color={item.isCompleted ? "#94a3b8" : "#ef4444"} />
                case 'mind': return <Brain size={16} color={item.isCompleted ? "#94a3b8" : "#3b82f6"} />
                default: return <Flame size={16} color={item.isCompleted ? "#94a3b8" : "#a855f7"} />
            }
        }

        const getCategoryStyle = () => {
             if (item.isCompleted) return styles.catDisabled
             switch(item.category) {
                 case 'body': return styles.catBody
                 case 'mind': return styles.catMind
                 default: return styles.catSpirit
             }
        }

        return (
            <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => toggleTask(item._id)}
                style={[styles.taskCard, item.isCompleted && styles.taskCompleted]}
            >
                <View style={styles.taskCardTop}>
                    <View style={[styles.statusBadge, item.isCompleted ? styles.badgeComplete : styles.badgeActive]}>
                        <Text style={[styles.badgeText, item.isCompleted ? styles.badgeTextComplete : styles.badgeTextActive]}>
                            {item.isCompleted ? 'COMPLETE' : 'ACTIVE'}
                        </Text>
                    </View>
                    {item.isCompleted ? (
                        <CheckCircle2 color="#22c55e" size={24} />
                    ) : (
                        <Circle color={isDark ? "#d1d5db" : "#94a3b8"} size={24} />
                    )}
                </View>

                <Text style={[styles.taskTitle, item.isCompleted && styles.taskTitleCompleted]}>
                    {item.task}
                </Text>

                <View style={styles.taskCardBottom}>
                    <View style={styles.taskDetails}>
                        {(item.quantity && item.unit) ? (
                            <Text style={[styles.metricText, item.isCompleted && styles.disabledText]}>
                                {item.quantity} {item.unit}
                            </Text>
                        ) : null}
                    </View>
                    
                    <View style={styles.tagsContainer}>
                        <View style={[styles.categoryTag, getCategoryStyle()]}>
                            {getCategoryIcon()}
                            <Text style={[
                                styles.categoryText, 
                                item.isCompleted && styles.disabledText,
                                !item.isCompleted && item.category === 'body' && {color: '#ef4444'},
                                !item.isCompleted && item.category === 'mind' && {color: '#3b82f6'},
                                !item.isCompleted && item.category !== 'body' && item.category !== 'mind' && {color: '#a855f7'}
                            ]}>
                                {item.category.toUpperCase()}
                            </Text>
                        </View>
                        <View style={[styles.xpTag, item.isCompleted && styles.xpTagCompleted]}>
                            <Text style={[styles.xpText, item.isCompleted && styles.disabledText]}>
                                +{item.xpValue} XP
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    if (loading || !tasks) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#a855f7" />
                <Text style={styles.loadingText}>Loading Daily Quests...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Circle color={isDark ? "#334155" : "#cbd5e1"} size={64} style={{ marginBottom: 16 }} />
                        <Text style={styles.emptyTitle}>No Active Quests</Text>
                        <Text style={styles.emptySubtitle}>Your quest log is empty. Head to choices to get new ones!</Text>
                    </View>
                )}
            />
            <ChoicesModal visible={showChoices} onClose={() => setShowChoices(false)} />
        </View>
    )
}

const getStyles = (isDark) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    loadingText: {
        color: isDark ? '#94a3b8' : '#64748b',
        marginTop: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
        padding: 20,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: isDark ? '#f1f5f9' : '#0f172a',
        marginBottom: 8,
    },
    emptySubtitle: {
        textAlign: 'center',
        color: isDark ? '#94a3b8' : '#64748b',
    },
    headerContainer: {
        marginBottom: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    headerTextContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: isDark ? '#fff' : '#0f172a',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: isDark ? '#94a3b8' : '#64748b',
        fontWeight: '500',
    },
    progressCard: {
        width: '100%',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    rankText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: isDark ? '#94a3b8' : '#64748b',
        letterSpacing: 1.5,
    },
    progressPercent: {
        fontSize: 28,
        fontWeight: '900',
        color: '#a855f7',
    },
    progressBarBg: {
        height: 16,
        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 10,
    },
    choicesButton: {
        width: '100%',
        marginTop: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    choicesButtonBg: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    choicesButtonText: {
        color: isDark ? '#e2e8f0' : '#334155',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
        letterSpacing: 0.5,
    },
    taskCard: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.1 : 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    taskCompleted: {
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        borderColor: isDark ? '#064e3b' : '#bbf7d0',
        opacity: 0.8,
    },
    taskCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
    },
    badgeActive: {
        backgroundColor: isDark ? 'rgba(30, 58, 138, 0.3)' : 'rgba(59, 130, 246, 0.1)',
        borderColor: isDark ? '#1e3a8a' : '#93c5fd',
    },
    badgeComplete: {
        backgroundColor: isDark ? 'rgba(20, 83, 45, 0.4)' : 'rgba(34, 197, 94, 0.1)',
        borderColor: isDark ? '#14532d' : '#86efac',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    badgeTextActive: {
        color: '#60a5fa',
    },
    badgeTextComplete: {
        color: '#4ade80',
    },
    taskTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: isDark ? '#f1f5f9' : '#0f172a',
        marginBottom: 16,
    },
    taskTitleCompleted: {
        color: '#64748b',
        textDecorationLine: 'line-through',
    },
    taskCardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metricText: {
        fontSize: 14,
        fontWeight: '600',
        color: isDark ? '#cbd5e1' : '#475569',
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    categoryTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        gap: 4,
    },
    catBody: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: isDark ? 'rgba(127, 29, 29, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    },
    catMind: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: isDark ? 'rgba(30, 58, 138, 0.3)' : 'rgba(59, 130, 246, 0.3)',
    },
    catSpirit: {
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: isDark ? 'rgba(88, 28, 135, 0.3)' : 'rgba(168, 85, 247, 0.3)',
    },
    catDisabled: {
        backgroundColor: 'transparent',
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    categoryText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    xpTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
    },
    xpTagCompleted: {
        backgroundColor: 'transparent',
    },
    xpText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fbbf24',
    },
    disabledText: {
        color: '#64748b',
    }
})

export default MainScreen