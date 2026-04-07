import { createContext , useContext , useState , useEffect } from "react";
import {useSocket} from "./socketContext"

const LeaderboardContext = createContext()
export const useLeaderboard = () => useContext(LeaderboardContext)

const API_URL = import.meta.env.VITE_API_URL + "/leaderboard"

const LeaderboardProvider = ({children}) =>{
    const {socket} = useSocket()
    const [globalLeaderboard , setGlobalLeaderboard] = useState(null)
    const [friendLeaderboard , setFriendLeaderboard] = useState(null)

    useEffect(() =>{
        if(!socket) return

        socket.emit("get-global-leaderboard")
        socket.emit("get-friend-leaderboard")

        socket.on("global-leaderboard-data" , (data) =>{
            setGlobalLeaderboard(data.leaderboard)
        })
        socket.on("friend-leaderboard-data" , (data) =>{
            setFriendLeaderboard(data.leaderboard)
        })

        return () =>{
            socket.off("global-leaderboard-data" , (data) =>{
                setGlobalLeaderboard(data.leaderboard)
            })
            socket.off("friend-leaderboard-data" , (data) =>{
                setFriendLeaderboard(data.leaderboard)
            })
        }
    },[socket])

    return (
        <LeaderboardContext.Provider value={{globalLeaderboard , friendLeaderboard}}>
            {children}
        </LeaderboardContext.Provider>
    )
}

export default LeaderboardProvider