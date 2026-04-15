import { createContext , useContext , useState , useEffect , useCallback } from "react";
import {useSocket} from "./socketContext"

const LeaderboardContext = createContext()
export const useLeaderboard = () => useContext(LeaderboardContext)

const LeaderboardProvider = ({children}) =>{
    const {socket} = useSocket()
    const [globalLeaderboard , setGlobalLeaderboard] = useState(null)
    const [friendLeaderboard , setFriendLeaderboard] = useState(null)
    const [loading , setLoading] = useState(true)

    const refreshLeaderboard = useCallback(() => {
        if(!socket) return
        socket.emit("get-global-leaderboard")
        socket.emit("get-friend-leaderboard")
    }, [socket])

    useEffect(() =>{
        if(!socket) return

        const handleGlobal = (data) => {
            setGlobalLeaderboard(data.leaderboard)
            setLoading(false)
        }
        const handleFriend = (data) => {
            setFriendLeaderboard(data.leaderboard)
            setLoading(false)
        }

        // Fetch on connect
        refreshLeaderboard()

        socket.on("global-leaderboard-data" , handleGlobal)
        socket.on("friend-leaderboard-data" , handleFriend)

        // Auto-refresh when any task is completed
        socket.on("task-completed" , refreshLeaderboard)

        return () =>{
            socket.off("global-leaderboard-data" , handleGlobal)
            socket.off("friend-leaderboard-data" , handleFriend)
            socket.off("task-completed" , refreshLeaderboard)
        }
    },[socket, refreshLeaderboard])

    return (
        <LeaderboardContext.Provider value={{globalLeaderboard , friendLeaderboard , loading , refreshLeaderboard}}>
            {children}
        </LeaderboardContext.Provider>
    )
}

export default LeaderboardProvider