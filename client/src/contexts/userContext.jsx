import {createContext , useContext , useState} from "react"
import {toast} from "react-toastify"
import {useNavigate} from "react-router"

const UserContext = createContext()
export const useUser = () => useContext(UserContext)

const API_URL = import.meta.env.VITE_API_URL + "/user"

const UserProvider = ({children}) =>{
    const [options , setOptions] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const setUserOptions = async(options) =>{
        const toastId = toast.loading("Setting choices...")
        try{
            const res = await fetch(API_URL + "/" , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(options),
                credentials: "include"
            })
            const data = await res.json()

            if(!res.ok) return toast.update(toastId , {type: "error" , message: data.message , isLoading: false , autoClose: 3000})

            navigate("/")
            toast.update(toastId , {type: "success" , message: data.message , isLoading: false , autoClose: 3000})
        }catch(err){
            console.log(err.message)
            toast.update(toastId , {type: "error" , message: "Something went wrong" , isLoading: false , autoClose: 3000})
        }
    }

    const getUserProfile = async (id) => {
        setLoading(true)
        try {
            const res = await fetch(API_URL + `/profile/${id}`, { method: "GET", credentials: "include" })
            const data = await res.json()

            if (!res.ok) {
                console.log(data.message)
                return null
            }
            return data
        } catch (err) {
            console.log(err.message)
            return null
        } finally {
            setLoading(false)
        }
    }
    return(
        <UserContext.Provider value={{options , setOptions , loading, setUserOptions , getUserProfile}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider