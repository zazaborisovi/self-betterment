import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../contexts/authContext"
import { Signup , Signin } from "../screens/AuthScreens"
import MainScreen from "../screens/MainScreen"
import LeaderboardScreen from "../screens/LeaderboardScreen"
import ProfileScreen from "../screens/ProfileScreen"
import FriendsScreen from "../screens/FriendsScreen"
import ChatScreen from "../screens/ChatScreen"
import { Home, Trophy, Users, User, MessageCircle } from "lucide-react-native"
import { useColorScheme } from "react-native"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const AuthStack = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen name="signup" options={{headerShown: false}} component={Signup} />
            <Stack.Screen name="signin" options={{headerShown: false}} component={Signin} />
        </Stack.Navigator>
    )
}

const HomeStack = () => {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Navigator>
    )
}

const ChatStack = () => {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChatList" component={ChatScreen} />
            <Stack.Screen name="ChatConversation" component={ChatScreen} />
        </Stack.Navigator>
    )
}

const MainTabs = () => {
    const colorScheme = useColorScheme()
    const isDark = colorScheme === 'dark'

    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let icon

                    if (route.name === 'home') {
                        icon = <Home color={color} size={size} />
                    } else if (route.name === 'friends') {
                        icon = <Users color={color} size={size} />
                    } else if (route.name === 'chat') {
                        icon = <MessageCircle color={color} size={size} />
                    } else if (route.name === 'leaderboard') {
                        icon = <Trophy color={color} size={size} />
                    } else if (route.name === 'profile') {
                        icon = <User color={color} size={size} />
                    }

                    return icon
                },
                tabBarActiveTintColor: '#a855f7',
                tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8',
                tabBarStyle: {
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8
                },
                tabBarLabelStyle: {
                    fontWeight: '600',
                    fontSize: 11,
                }
            })}
        >
            <Tab.Screen name="home" component={HomeStack} options={{ title: 'Home' }} />
            <Tab.Screen name="friends" component={FriendsScreen} options={{ title: 'Friends' }} />
            <Tab.Screen name="chat" component={ChatStack} options={{ title: 'Chat' }} />
            <Tab.Screen name="leaderboard" component={LeaderboardScreen} options={{ title: 'Ranks' }} />
            <Tab.Screen name="profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </Tab.Navigator>
    )
}

export default function RootNavigator(){
    const {user} = useAuth()

    return user ? <MainTabs /> : <AuthStack />
}
