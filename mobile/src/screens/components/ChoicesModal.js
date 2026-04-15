import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Dimensions, useColorScheme, Platform, Modal } from "react-native"
import { useUser } from "../../contexts/userContext"
import { LinearGradient } from "expo-linear-gradient"
import { Search, Dumbbell, Brain, Heart, CheckCircle2, Circle, X } from "lucide-react-native"

const { width } = Dimensions.get("window")

const choiceArr = [
    { value: "Pushups", type: "body" },
    { value: "Morning Jog", type: "body" },
    { value: "Plank", type: "body" },
    { value: "Read Book", type: "mind" },
    { value: "Coding Sprint", type: "mind" },
    { value: "Logic Puzzles", type: "mind" },
    { value: "Meditation", type: "soul" },
    { value: "Journal Entry", type: "soul" },
    { value: "Digital Detox", type: "soul" }
]

const ChoicesModal = ({ visible, onClose }) => {
    const { setUserOptions } = useUser()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'
    const styles = getStyles(isDark)

    const [selectedChoices, setSelectedChoices] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("All")

    const handleChoice = (choiceVal) => {
        if (selectedChoices.includes(choiceVal)) {
            setSelectedChoices(prev => prev.filter(c => c !== choiceVal))
        } else {
            setSelectedChoices(prev => [...prev, choiceVal])
        }
    }

    const handleSubmit = async () => {
        if (selectedChoices.length > 0) {
            await setUserOptions(selectedChoices)
            setSelectedChoices([])
            setSearchQuery("")
            setActiveCategory("All")
            onClose()
        }
    }

    const handleDismiss = () => {
        setSelectedChoices([])
        setSearchQuery("")
        setActiveCategory("All")
        onClose()
    }

    // Filter choices
    const filteredChoices = choiceArr.filter(choice => {
        const matchesSearch = choice.value.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === "All" || choice.type === activeCategory
        return matchesSearch && matchesCategory
    })

    const getIconForType = (type, isSelected) => {
        const color = isSelected ? (isDark ? '#e2e8f0' : '#475569') : (isDark ? '#a855f7' : '#8b5cf6')
        switch (type) {
            case 'body': return <Dumbbell size={28} color={isSelected ? color : (isDark ? '#ef4444' : '#dc2626')} />
            case 'mind': return <Brain size={28} color={isSelected ? color : (isDark ? '#3b82f6' : '#2563eb')} />
            case 'soul': return <Heart size={28} color={isSelected ? color : (isDark ? '#eab308' : '#ca8a04')} />
            default: return <Heart size={28} color={color} />
        }
    }

    const categories = ["All", "body", "mind", "soul"]

    const renderChoice = ({ item }) => {
        const isSelected = selectedChoices.includes(item.value)
        
        return (
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => handleChoice(item.value)}
                style={[
                    styles.choiceCard,
                    isSelected ? styles.choiceSelected : styles.choiceUnselected
                ]}
            >
                {isSelected && (
                    <LinearGradient
                        colors={['rgba(168, 85, 247, 0.2)', 'rgba(59, 130, 246, 0.2)']}
                        style={StyleSheet.absoluteFillObject}
                        borderRadius={16}
                    />
                )}
                
                <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                    {getIconForType(item.type, isSelected)}
                </View>

                <View style={styles.choiceTextContainer}>
                    <Text style={[styles.choiceType, isSelected && styles.choiceTypeSelected]}>
                        {item.type.toUpperCase()}
                    </Text>
                    <Text style={[styles.choiceValue, isSelected && styles.choiceValueSelected]}>
                        {item.value}
                    </Text>
                </View>

                <View style={styles.checkContainer}>
                    {isSelected ? (
                        <CheckCircle2 color={isDark ? '#a855f7' : '#8b5cf6'} size={24} />
                    ) : (
                        <Circle color={isDark ? '#475569' : '#cbd5e1'} size={24} />
                    )}
                </View>
            </TouchableOpacity>
        )
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerTopRow}>
                <Text style={styles.headerTitle}>Design Your Day</Text>
                <TouchableOpacity onPress={handleDismiss} style={styles.closeButton} activeOpacity={0.7}>
                    <X color={isDark ? '#94a3b8' : '#64748b'} size={24} />
                </TouchableOpacity>
            </View>
            <Text style={styles.headerSubtitle}>Select the daily missions you'd like to commit to.</Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search color={isDark ? '#94a3b8' : '#64748b'} size={20} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search options..."
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Categories */}
            <View style={styles.categoriesWrapper}>
                <FlatList
                    horizontal
                    data={categories}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => setActiveCategory(item)}
                            style={[
                                styles.categoryPill, 
                                activeCategory === item ? styles.categoryActive : styles.categoryInactive
                            ]}
                        >
                            <Text style={[
                                styles.categoryPillText, 
                                activeCategory === item ? styles.categoryTextActive : styles.categoryTextInactive
                            ]}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            
            <Text style={styles.selectionCount}>
                {selectedChoices.length} items selected
            </Text>
        </View>
    )

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleDismiss}
        >
            <View style={styles.container}>
                <FlatList
                    data={filteredChoices}
                    keyExtractor={(item) => item.value}
                    renderItem={renderChoice}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={renderHeader}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.footer}>
                    <TouchableOpacity 
                        activeOpacity={0.9} 
                        onPress={handleSubmit}
                        disabled={selectedChoices.length === 0}
                        style={[styles.submitButtonWrapper, selectedChoices.length === 0 && { opacity: 0.5 }]}
                    >
                        <LinearGradient
                            colors={['#4f46e5', '#9333ea', '#3b82f6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.submitGradient}
                        >
                            <Text style={styles.submitText}>
                                Confirm Choices
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const getStyles = (isDark) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 20 : 20,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 20,
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: '900',
        color: isDark ? '#fff' : '#0f172a',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        color: isDark ? '#94a3b8' : '#64748b',
        marginBottom: 24,
        lineHeight: 22,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#f1f5f9',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 54,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: isDark ? '#f8fafc' : '#0f172a',
        fontSize: 16,
    },
    categoriesWrapper: {
        marginBottom: 16,
    },
    categoryPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
    },
    categoryActive: {
        backgroundColor: isDark ? '#3b82f6' : '#2563eb',
        borderColor: isDark ? '#3b82f6' : '#2563eb',
    },
    categoryInactive: {
        backgroundColor: 'transparent',
        borderColor: isDark ? '#475569' : '#cbd5e1',
    },
    categoryPillText: {
        fontWeight: '600',
        fontSize: 14,
    },
    categoryTextActive: {
        color: '#fff',
    },
    categoryTextInactive: {
        color: isDark ? '#94a3b8' : '#64748b',
    },
    selectionCount: {
        fontSize: 13,
        fontWeight: 'bold',
        color: isDark ? '#a855f7' : '#8b5cf6',
        marginTop: 4,
        marginBottom: 8,
    },
    row: {
        justifyContent: 'space-between',
    },
    choiceCard: {
        width: (width - 44) / 2,
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        alignItems: 'center',
        borderWidth: 2,
        position: 'relative',
    },
    choiceSelected: {
        borderColor: isDark ? '#a855f7' : '#8b5cf6',
        backgroundColor: isDark ? '#1e293b' : '#f5f3ff',
        transform: [{ scale: 1.02 }],
    },
    choiceUnselected: {
        borderColor: isDark ? '#334155' : '#e2e8f0',
        backgroundColor: isDark ? '#1e293b' : '#fff',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    iconContainerSelected: {
        backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(139, 92, 246, 0.1)',
    },
    choiceTextContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    choiceType: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 4,
        color: isDark ? '#64748b' : '#94a3b8',
    },
    choiceTypeSelected: {
        color: isDark ? '#c084fc' : '#8b5cf6',
    },
    choiceValue: {
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
        color: isDark ? '#f8fafc' : '#1e293b',
    },
    choiceValueSelected: {
        color: isDark ? '#fff' : '#4c1d95',
    },
    checkContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderTopWidth: 1,
        borderColor: isDark ? '#334155' : '#e2e8f0',
    },
    submitButtonWrapper: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#a855f7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    submitGradient: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    }
})

export default ChoicesModal
