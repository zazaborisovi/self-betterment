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
                const res = await fetch(API_URL + "/" , {method: "GET"})
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

    
}