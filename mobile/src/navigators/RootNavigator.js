import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/authContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function RootNavigator() {
    const user = useAuth()
    return (
        <Tab.Navigator>
            {
                !user ? (
                    <>
                        <Tab.Screen name="signup" component={Signup} />
                        <Tab.Screen name="signin" component={Signin} />
                    </>
                ) : (
                    <Stack.Screen name="App" component={AppNavigator} />
                )
            }
        </Tab.Navigator>
    )
}