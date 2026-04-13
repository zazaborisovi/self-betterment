import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "../contexts/authContext"
import { Signup , Signin } from "../screens/AuthScreens"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

export default function RootNavigator(){
    const {user} = useAuth()

    return(
        <Stack.Navigator>
            {
                !user ? (
                    <>
                        <Tab.Screen name="signup" component={Signup} />
                        <Tab.Screen name="signin" component={Signin} />
                    </>
                ) : (
                    <Tab.Screen name="home" component={() => <Text>home</Text>} />
                )
            }
        </Stack.Navigator>
    )
}