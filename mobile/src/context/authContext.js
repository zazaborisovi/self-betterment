import { createContext , useContext , useState , useEffect } from "react";
import * as Sentry from "@sentry/react-native"
import { Alert } from "react-native";
import {useNavigation} from "@react-navigation/native"

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const API_URL = import.meta.env.EXPO_PUBLIC_API_URL + "/auth"

const AuthProvider = ({children}) =>{
    const [loading , setLoading] = useState(true)
    const [user , setUser] = useState(null)
    const navigation = useNavigation()

    useEffect(() =>{
        (async() =>{
            try{
                const res = await fetch(`${API_URL}/auto-signin` , {
                    method: "GET",
                    credentials: "include"
                })
                const data = await res.json()

                if(!res.ok) return

                setUser(data.user)
            }catch(err){
                Sentry.captureException(new Error(err.message))
            }finally{
                setLoading[false]
            }
        })
    }, [])

    const signup = async(formData) =>{
        try{
            const res = await fetch(`${API_URL}/signup` , {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if(!res.ok) return Alert.alert("Error", data.message , [{text: "OK"}])

            setUser(data.user)
            data.user.choices.length > 0 ? navigation.navigate("Home") : navigation.navigate("Choices")
        }catch(err){
            Sentry.captureException(new Error(err.message))
        }
    }

    const signin = async(formData) =>{
        try{
            const res = await fetch(`${API_URL}/signin` , {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if(!res.ok) return Alert.alert("Error", data.message , [{text: "OK"}])

            setUser(data.user)
            data.user.choices.length > 0 ? navigation.navigate("Home") : navigation.navigate("Choices")
        }catch(err){
            Sentry.captureException(new Error(err.message))
        }
    }

    const signout = async() =>{
        try{
            const res = await fetch(`${API_URL}/signout` , {
                method: "POST",
                credentials: "include"
            })
            const data = await res.json()
            
            if(!data.ok) return Alert.alert("Error" , "Failed to sign out" , [{text: "OK"}])

            setUser(null)
            navigation.navigate("Signin")
        }catch(err){
            Sentry.captureException(new Error(err.message))
        }
    }

    return(
        <AuthContext.Provider value={{user , signup , signin , signout}}>
            {children}
        </AuthContext.Provider>
    )
}