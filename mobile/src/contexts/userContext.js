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
        
        socket.on("streak-updated" , (data) =>{
            setUser(prev => ({...prev , ...data.update}))
            console.log("Streak updated:" , data.update)
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
            socket.off("streak-updated" , (data) =>{
                setUser(prev => ({...prev , ...data.update}))
                console.log("Streak updated:" , data.update)
            })
        }
    }, [socket , user?.choices])

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

    const changeProfilePicture = async (uri) => {
        try {
            const formData = new FormData()
            
            // Extract filename and type from URI
            const filename = uri.split('/').pop()
            const match = /\.(\w+)$/.exec(filename)
            const type = match ? `image/${match[1]}` : `image`

            formData.append("file", {
                uri: uri,
                name: filename,
                type: type
            })

            const res = await fetch(`${API_URL}/change-profile-picture`, {
                method: "POST",
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                credentials: "include"
            })

            const data = await res.json()
            if (!res.ok) {
                console.log(data.message)
                return null
            }

            // Update local user state
            if (data.updatedUser) {
                setUser(data.updatedUser)
            }
            
            return data
        } catch (err) {
            console.log(err.message)
            return null
        }
    }
    return(
        <UserContext.Provider value={{ loading, setUserOptions , getUserProfile , changeProfilePicture , users}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider