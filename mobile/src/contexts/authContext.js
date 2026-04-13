import { createContext , useContext , useState , useEffect } from "react";
import { useNavigation } from "@react-navigation/native"
import { Alert } from "react-native";

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const API_URL = process.env.EXPO_PUBLIC_API_URL + "/auth"

const AuthProvider = ({children}) =>{
    const [user , setUser] = useState(null)
    const [loading , setLoading] = useState(true)
    const navigation = useNavigation()
    
    useEffect(() =>{
        (async() =>{
            try{
                const res = await fetch(`${API_URL}/auto-signin`, {method: "GET" , credentials: "include"})
                const data = await res.json()

                if(!res.ok) return

                setUser(data.user)
            }catch(err){
                console.log(err.message)
            }finally{
                setLoading(false)
            }
        })()
    },[])

    const signup = async(formData) =>{
        try{
            const res = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include"
            })
            const data = await res.json()
            
            if(!res.ok) return Alert.alert("Error while signing up" , data.message)

            setUser(data.user)
            data.user.choices.length > 0 ? navigation.navigate("home") : navigate("choices")
        }catch(err){
            console.log(err.message)
        }
    }
    
    const signin = async(formData) =>{
        try{
            const res = await fetch(`${API_URL}/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include"
            })
            const data = await res.json()

            if(!res.ok) return Alert.alert("Error while signing in" , data.message)

            setUser(data.user)
            data.user.choices.length > 0 ? navigation.navigate("home") : navigate("choices")
        }catch(err){
            console.log(err.message)
        }
    }

    const signout = async() =>{
        try{
            const res = await fetch(`${API_URL}/signout` , {
                method: "POST",
                credentials: "include"
            })
            const data = await res.json()

            if(!res.ok) return Alert.alert("Error signing out" , data.message)

            setUser(null)
            navigation.navigate("signin")
        }catch(err){
            console.log(err.message)
        }
    } 

    return(
        <AuthContext.Provider value={{user , setUser , loading , signup , signin , signout}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider