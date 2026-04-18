import {createContext , useContext , useState , useEffect} from "react"
import { useAuth } from "./authContext"
import { useSocket } from "./socketContext"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"

const UserContext = createContext()
export const useUser = () => useContext(UserContext)

const API_URL = import.meta.env.VITE_API_URL + "/user"

const UserProvider = ({children}) =>{
    const [users , setUsers] = useState([])
    const {user , setUser} = useAuth()
    const { socket } = useSocket()

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() =>{
        if(!socket) return

        socket.on("choices-set" , (data) =>{
            setUser(prev => ({...prev , ...data.update}))
            navigate("/")
        })

        socket.on("users-data" , (data) =>{
            setUsers(data.update.users)
            console.log(data.update.users)
        })

        return () =>{
            socket.off("choices-set" , (data) =>{
                setUser(prev => ({...prev , ...data.update}))
                navigate("/")
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

    const fetchAllUsers = () => {
        if (socket) {
            socket.emit("get-all-users")
        }
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

    const changeProfilePicture = async (file) =>{
        const toastId = toast.loading("Changing profile picture...")
        try{
            const formData = new FormData()
            formData.append("file", file)
            console.log(file)
            const res = await fetch(`${API_URL}/change-profile-picture` , {
                method: "POST",
                body: formData,
                credentials: "include"
            })
            const data = await res.json()
            if(!res.ok){
                return toast.update(toastId , {
                    render: data.message,
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                })
            }
            toast.update(toastId , {
                render: data.message,
                type: "success",
                isLoading: false,
                autoClose: 3000
            })
            setUser(data.updatedUser)
        }catch(err){
            toast.update(toastId , {
                render: err.message,
                type: "error",
                isLoading: false,
                autoClose: 3000
            })
        }
    }

    return(
        <UserContext.Provider value={{ loading, setUserOptions , getUserProfile , changeProfilePicture , users, fetchAllUsers}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider