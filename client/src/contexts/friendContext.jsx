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
        if(!socket) return

        socket.emit("get-friends")
        socket.emit("get-friend-requests")

        socket.on("friends" , (data) =>{
            setFriends(data.friends)
        })
        socket.on("friend-requests" , (data) =>{
            setFriendRequests(data.friendRequests)
        })

        return () =>{
            socket.off("friends" , (data) =>{
                setFriends(data.friends)
            })
            socket.off("friend-requests" , (data) =>{
                setFriendRequests(data.friendRequests)
            })
        }
    }, [socket , friendRequests , friends])

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
        const cancelRequest = (data) =>{
            toast.success(data.message)
            setFriendRequests(prev => prev.filter(request => request._id !== data._id))
        }

        socket.on("friend-request-received", friendRequestReceived)
        socket.on("friend-request-sent", friendRequestSent)

        socket.on("friend-request-accepted", friendRequestAccepted)
        socket.on("friend-request-rejected", friendRequestRejected)

        socket.on("friend-removed", friendRemoved)
        socket.on("friend-request-cancelled", cancelRequest)

        return () =>{
            socket.off("friend-request-received", friendRequestReceived)
            socket.off("friend-request-sent", friendRequestSent)
            socket.off("friend-request-accepted", friendRequestAccepted)
            socket.off("friend-request-rejected", friendRequestRejected)
            socket.off("friend-removed", friendRemoved)
            socket.off("friend-request-cancelled", cancelRequest)
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
    const cancelFriendRequest = async(requestId) =>{
        socket.emit("cancel-friend-request" , {requestId})
    }

    return(
        <FriendContext.Provider value={{friendRequests , friends , sendFriendRequest , acceptFriendRequest , rejectFriendRequest , cancelFriendRequest}}>
            {children}
        </FriendContext.Provider>
    )
    
}

export default FriendProvider