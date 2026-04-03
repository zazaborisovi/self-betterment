import { createContext , useContext , useState , useEffect } from "react";

const LeaderboardContext = createContext()
export const useLeaderboard = () => useContext(LeaderboardContext)

const API_URL = import.meta.env.VITE_API_URL + "/leaderboard"

const LeaderboardProvider = ({children}) =>{
    const [leaderboard , setLeaderboard] = useState(null)

    useEffect(() =>{
        (async()=>{
            try{
                const res = await fetch(API_URL + "/", {method: "GET"})
                const data = await res.json()

                if(!res.ok) return console.log(data.message)
                
                console.log(data)
                setLeaderboard(data.leaderboard)
            }catch(err){
                console.log(err.message)
            }
        })()
    },[])

    return (
        <LeaderboardContext.Provider value={{leaderboard}}>
            {children}
        </LeaderboardContext.Provider>
    )
}

export default LeaderboardProvider