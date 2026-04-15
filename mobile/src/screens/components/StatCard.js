import { View, Text, StyleSheet, useColorScheme } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

const StatCard = ({ title, xp, maxXp, rank, gradientColors, icon }) => {
    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'
    const styles = getStyles(isDark)

    const progress = maxXp > 0 ? Math.min((xp / maxXp) * 100, 100) : 0

    return (
        <View style={styles.card}>
            {/* Decorative corner glow */}
            <LinearGradient
                colors={[gradientColors[0] + '30', 'transparent']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.cornerGlow}
            />

            <View style={styles.topRow}>
                <View style={styles.titleRow}>
                    {icon && <View style={styles.iconWrap}>{icon}</View>}
                    <Text style={styles.title}>{title}</Text>
                </View>
                <Text style={[styles.rankValue, { color: gradientColors[0] }]}>{rank}</Text>
            </View>

            <View style={styles.xpSection}>
                <View style={styles.xpLabels}>
                    <Text style={styles.xpLabel}>EXP</Text>
                    <Text style={styles.xpValue}>{xp} / {maxXp}</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${progress}%`, opacity: 0.7 }]}
                    />
                </View>
            </View>
        </View>
    )
}

const getStyles = (isDark) => StyleSheet.create({
    card: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 12,
    },
    cornerGlow: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 80,
        height: 80,
        borderBottomLeftRadius: 60,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrap: {
        marginRight: 8,
    },
    title: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: isDark ? '#94a3b8' : '#64748b',
    },
    rankValue: {
        fontSize: 36,
        fontWeight: '900',
    },
    xpSection: {
        marginTop: 4,
    },
    xpLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    xpLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: isDark ? '#64748b' : '#94a3b8',
    },
    xpValue: {
        fontSize: 13,
        fontWeight: 'bold',
        color: isDark ? '#e2e8f0' : '#334155',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
    },
})

export default StatCard
