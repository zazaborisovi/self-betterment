import { createContext , useContext , useState , useEffect } from "react";
import {useSocket} from "./socketContext"
import { toast } from "react-toastify";

const FriendContext = createContext()
export const useFriend = () => useContext(FriendContext)

const API_URL = import.meta.env.VITE_API_URL + "/friends"

const FriendProvider = ({children}) =>{
    const {socket} = useSocket()
    const [friendRequests , setFriendRequests] = useState(null)
    const [friends , setFriends] = useState(null)

    useEffect(() =>{
        (async() =>{
            try{
                const res = await fetch(API_URL + "/" , {method: "GET" , credentials: "include"})
                const data = await res.json()
                
                if(!res.ok) return console.log(data.message)

                setFriends(data)
            }catch(err){
                console.log(err.message)
            }
        })();

        (async() =>{
            try{
                const res = await fetch(API_URL + "/requests" , {method: "GET" , credentials: "include"})
                const data = await res.json()
                
                if(!res.ok) return console.log(data.message)

                setFriendRequests(data)
            }catch(err){
                console.log(err.message)
            }
        })()
    }, [])

    useEffect(() =>{
        if(!socket) return

        const friendRequestReceived = (data) =>{
            toast.success(data.message)
            setFriendRequests(prev => [...prev , data])
        }
        const friendRequestSent = (data) =>{
            toast.success(data.message)
        }
        const friendRequestAccepted = (data) =>{
            toast.success(data.message)
            setFriends(prev => [...prev , data])
        }
        const friendRequestRejected = (data) =>{
            toast.success(data.message)
            setFriendRequests(prev => prev.filter(request => request._id !== data._id))
        }
        const friendRemoved = (data) =>{
            toast.success(data.message)
            setFriends(prev => prev.filter(friend => friend._id !== data._id))
        }
        
        socket.on("friend-request-received" , friendRequestReceived)
        socket.on("friend-request-sent" , friendRequestSent)

        socket.on("friend-request-accepted" , friendRequestAccepted)

        socket.on("friend-request-rejected" , friendRequestRejected)

        socket.on("friend-removed" , friendRemoved)

        return () =>{
            socket.off("friend-request-received" , friendRequestReceived)
            socket.off("friend-request-sent" , friendRequestSent)
            socket.off("friend-request-accepted" , friendRequestAccepted)
            socket.off("friend-request-rejected" , friendRequestRejected)
            socket.off("friend-removed" , friendRemoved)
        }
    }, [socket])

    const sendFriendRequest = async(to) =>{
        socket.emit("send-friend-request" , {to})
    }
    const acceptFriendRequest = async(from) =>{
        socket.emit("accept-friend-request" , {from})
    }
    const rejectFriendRequest = async(from) =>{
        socket.emit("reject-friend-request" , {from})
    }

    return(
        <FriendContext.Provider value={{friendRequests , friends , sendFriendRequest , acceptFriendRequest , rejectFriendRequest}}>
            {children}
        </FriendContext.Provider>
    )
    
}

export default FriendProvider