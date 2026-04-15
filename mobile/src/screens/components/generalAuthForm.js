import { Text, TextInput, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, useColorScheme } from "react-native"
import { useForm } from "../../hooks/useForm"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { LinearGradient } from "expo-linear-gradient"
import { Eye, EyeOff } from "lucide-react-native"

const { width } = Dimensions.get('window')

const GeneralAuthForm = ({ func }) => {
    const isSignup = func.name.toLowerCase().includes("signup")
    const [showPassword, setShowPassword] = useState(false)
    const [formData, handleChange] = useForm({
        email: "",
        ...(isSignup ? { username: "" } : undefined),
        password: ""
    })
    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'
    const styles = getStyles(isDark)
    
    const handleSubmit = () => {
        func(formData)
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {isSignup ? "Create Account" : "Welcome Back"}
                    </Text>
                    <Text style={styles.subtitle}>
                        {isSignup ? "Join us and start your betterment journey" : "Enter your credentials to access your account"}
                    </Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="you@example.com"
                        placeholderTextColor={isDark ? "#6b7280" : "#94a3b8"}
                        value={formData.email}
                        onChangeText={(text) => handleChange({ target: { name: "email", value: text } })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {isSignup && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Choose a username"
                            placeholderTextColor={isDark ? "#6b7280" : "#94a3b8"}
                            value={formData.username}
                            onChangeText={(text) => handleChange({ target: { name: "username", value: text } })}
                            autoCapitalize="none"
                        />
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter your password"
                            placeholderTextColor={isDark ? "#6b7280" : "#94a3b8"}
                            value={formData.password}
                            onChangeText={(text) => handleChange({ target: { name: "password", value: text } })}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity 
                            style={styles.eyeIcon} 
                            onPress={() => setShowPassword(prev => !prev)}
                            activeOpacity={0.7}
                        >
                            {showPassword ? (
                                <EyeOff size={20} color={isDark ? "#9ca3af" : "#64748b"} />
                            ) : (
                                <Eye size={20} color={isDark ? "#9ca3af" : "#64748b"} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>
                        {isSignup ? "Already have an account? " : "Don't have an account? "}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.reset({
                        index: 0,
                        routes: [{ name: isSignup ? "signin" : "signup" }],
                    })}>
                        <Text style={styles.switchLink}>
                            {isSignup ? "Sign In" : "Sign Up"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    activeOpacity={0.8} 
                    onPress={handleSubmit}
                    style={styles.submitButtonWrapper}
                >
                    <LinearGradient
                        colors={['#4f46e5', '#9333ea', '#3b82f6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.submitGradient}
                    >
                        <Text style={styles.submitText}>
                            {isSignup ? "Create Account" : "Sign In"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const getStyles = (isDark) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    formContainer: {
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: isDark ? 0.25 : 0.05,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: isDark ? '#fff' : '#0f172a',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: isDark ? '#9ca3af' : '#64748b',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: isDark ? '#d1d5db' : '#334155',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f1f5f9',
        borderWidth: 1,
        borderColor: isDark ? '#374151' : '#cbd5e1',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: isDark ? '#fff' : '#0f172a',
        fontSize: 16,
    },
    passwordContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    passwordInput: {
        width: '100%',
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f1f5f9',
        borderWidth: 1,
        borderColor: isDark ? '#374151' : '#cbd5e1',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingRight: 50,
        color: isDark ? '#fff' : '#0f172a',
        fontSize: 16,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        padding: 4,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 24,
    },
    switchText: {
        color: isDark ? '#d1d5db' : '#475569',
        fontSize: 14,
    },
    switchLink: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 14,
    },
    submitButtonWrapper: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
    },
    submitGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    }
})

export default GeneralAuthForm