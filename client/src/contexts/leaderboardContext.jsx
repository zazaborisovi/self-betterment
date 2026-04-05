import { createContext , useContext , useState , useEffect } from "react";
import {useSocket} from "./socketContext"

const LeaderboardContext = createContext()
export const useLeaderboard = () => useContext(LeaderboardContext)

const API_URL = import.meta.env.VITE_API_URL + "/leaderboard"

const LeaderboardProvider = ({children}) =>{
    const {socket} = useSocket()
    const [leaderboard , setLeaderboard] = useState(null)

    useEffect(() =>{
        if(!socket) return

        socket.emit("leaderboard")

        socket.on("leaderboard-data" , (data) =>{
            setLeaderboard(data.leaderboard)
        })

        return () =>{
            socket.off("leaderboard-data" , (data) =>{
                setLeaderboard(data.leaderboard)
            })
        }
    },[socket])

    return (
        <LeaderboardContext.Provider value={{leaderboard}}>
            {children}
        </LeaderboardContext.Provider>
    )
}

export default LeaderboardProvider