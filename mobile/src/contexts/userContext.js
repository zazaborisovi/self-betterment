import {createContext , useContext , useState , useEffect} from "react"
import {useNavigation} from "@react-navigation/native"
import { useAuth } from "./authContext"
import { useSocket } from "./socketContext"

const UserContext = createContext()
export const useUser = () => useContext(UserContext)

const API_URL = process.env.EXPO_PUBLIC_API_URL + "/user"

const UserProvider = ({children}) =>{
    const [users , setUsers] = useState([])
    const {user , setUser} = useAuth()
    const { socket } = useSocket()

    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()

    useEffect(() =>{
        if(!socket) return

        socket.on("choices-set" , (data) =>{
            setUser(prev => ({...prev , ...data.update}))
            console.log(data.update)
        })

        socket.on("users-data" , (data) =>{
            setUsers(data.update.users)
            console.log(data.update.users)
        })

        return () =>{
            socket.off("choices-set" , (data) =>{
                setUser(prev => ({...prev , ...data.update}))
                console.log(data.update)
            })
            socket.off("users-data" , (data) =>{
                setUsers(data.update.users)
                console.log(data.update.users)
            })
        }
    }, [socket])

    const setUserOptions = (options) =>{
        socket.emit("set-choices" , options)
    }

    const getUserProfile = async (id) => {
        setLoading(true)
        try {
            const res = await fetch(API_URL + `/profile/${id}`, { method: "GET", credentials: "include" })
            const data = await res.json()

            if (!res.ok) {
                console.log(data.message)
                return null
            }
            return data
        } catch (err) {
            console.log(err.message)
            return null
        } finally {
            setLoading(false)
        }
    }
    return(
        <UserContext.Provider value={{ loading, setUserOptions , getUserProfile , users}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider