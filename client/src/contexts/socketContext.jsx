import { createContext , useContext , useState , useEffect , useRef } from "react";
import { io } from "socket.io-client"
import { useAuth } from "./authContext";
import {toast} from "react-toastify"

const SocketContext = createContext()
export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({children}) =>{
    const {user} = useAuth()
    const [socket , setSocket] = useState(null)
    const socketRef = useRef(null)

    useEffect(() =>{

        if(socketRef.current) socketRef.current.disconnect()

        const newSocket = io(import.meta.env.VITE_SOCKET_URL , {withCredentials: true})
        socketRef.current = newSocket
        setSocket(newSocket)

        return () =>{
            socketRef.current.disconnect()
        }
    },[user?._id])

    useEffect(() =>{
        if(!socket) return

        socket.on("error" , (data) =>{
            toast.error(data.message)
        })

        return () =>{
            socket.off("error" , (data) =>{
                toast.error(data.message)
            })
        }
    }, [socket])

    
    return (
        <SocketContext.Provider value={{socketRef , socket}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider