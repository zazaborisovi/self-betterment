import { NavigationContainer } from "@react-navigation/native";
import AuthProvider from "./src/contexts/authContext";
import RootNavigator from "./src/navigators/RootNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}