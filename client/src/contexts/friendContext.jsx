import { createContext , useContext , useState , useEffect } from "react";
import {useSocket} from "./socketContext"

const FriendContext = createContext()
export const useFriend = () => useContext(FriendContext)

const API_URL = import.meta.env.VITE_API_URL + "/friends"

const FriendProvider = ({children}) =>{
    const {socketRef} = useSocket()
    const [friendRequests , setFriendRequests] = useState(null)
    const [friends , setFriends] = useState(null)

    useEffect(() =>{
        (async() =>{
            try{
                const res = await fetch(API_URL + "/" , {method: "GET" })
                const data = await res.json()
                
                if(!res.ok) return console.log(data.message)

                setFriends(data)
            }catch(err){
                console.log(err.message)
            }
        })()

        (async() =>{
            try{
                const res = await fetch(API_URL + "/requests" , {method: "GET"})
                const data = await res.json()
                
                if(!res.ok) return console.log(data.message)

                setFriendRequests(data)
            }catch(err){
                console.log(err.message)
            }
        })()
    }, [])

    useEffect(() =>{
        socketRef.current.on("friend-request-received" , (data) =>{
            setFriendRequests(prev => [...prev , data])
        })

        socketRef.current.on("friend-request-accepted" , (data) =>{
            setFriends(prev => [...prev , data])
        })

        socketRef.current.on("friend-request-rejected" , (data) =>{
            setFriendRequests(prev => prev.filter(request => request._id !== data._id))
        })

        socketRef.current.on("friend-removed" , (data) =>{
            setFriends(prev => prev.filter(friend => friend._id !== data._id))
        })
    }, [])

    const sendFriendRequest = async(to) =>{
        socketRef.current.emit("send-friend-request" , {to})
    }
    const acceptFriendRequest = async(from) =>{
        socketRef.current.emit("accept-friend-request" , {from})
    }
    const rejectFriendRequest = async(from) =>{
        socketRef.current.emit("reject-friend-request" , {from})
    }

    return(
        <FriendContext.Provider value={{friendRequests , friends , sendFriendRequest}}>
            {children}
        </FriendContext.Provider>
    )
    
}

export default FriendProvider