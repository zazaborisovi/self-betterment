import { createContext , useContext , useState , useEffect , useRef } from "react";
import { io } from "socket.io-client"

const SocketContext = createContext()
export const useSocket = () => useContext(SocketContext)

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
const socket = io(SOCKET_URL , {withCredentials: true})

const SocketProvider = ({children}) =>{
    const socketRef = useRef(socket)

    return (
        <SocketContext.Provider value={{socketRef}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider