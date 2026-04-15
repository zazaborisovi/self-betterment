import { createContext , useContext , useState , useEffect , useRef } from "react";
import { useAuth } from "./authContext";
import { Alert } from "react-native";
import { io } from "socket.io-client"

const SocketContext = createContext()
export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({children}) =>{
    const {user} = useAuth()
    const [socket , setSocket] = useState(null)
    const socketRef = useRef(null)

    useEffect(() =>{

        if(socketRef.current) socketRef.current.disconnect()

        if(!user?._id) {
            setSocket(null)
            return
        }

        const newSocket = io(process.env.EXPO_PUBLIC_SOCKET_URL , {withCredentials: true})
        socketRef.current = newSocket
        setSocket(newSocket)

        return () =>{
            socketRef.current.disconnect()
        }
    },[user?._id])

    useEffect(() =>{
        if(!socket) return

        socket.on("error" , (data) =>{
            Alert.alert("error" , data.message)
        })

        return () =>{
            socket.off("error" , (data) =>{
                Alert.alert("error" , data.message)
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