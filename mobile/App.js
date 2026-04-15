import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import AuthProvider from "./src/contexts/authContext";
import RootNavigator from "./src/navigators/RootNavigator";
import UserProvider from "./src/contexts/userContext";
import TaskProvider from "./src/contexts/taskContext";
import SocketProvider from "./src/contexts/socketContext";
import LeaderboardProvider from "./src/contexts/leaderboardContext";
import FriendProvider from "./src/contexts/friendContext";
import ChatProvider from "./src/contexts/chatContext";

const AppDarkTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: '#0f172a', card: '#0f172a', border: '#1e293b' },
};
const AppLightTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#f8fafc', card: '#ffffff', border: '#e2e8f0' },
};

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
        <NavigationContainer theme={isDark ? AppDarkTheme : AppLightTheme}>
          <AuthProvider>
            <SocketProvider>
              <UserProvider>
                <TaskProvider>
                  <LeaderboardProvider>
                    <FriendProvider>
                      <ChatProvider>
                        <RootNavigator />
                      </ChatProvider>
                    </FriendProvider>
                  </LeaderboardProvider>
                </TaskProvider>
              </UserProvider>
            </SocketProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}