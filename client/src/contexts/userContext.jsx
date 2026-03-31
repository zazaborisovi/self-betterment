import {createContext , useContext , useState} from "react"
import {toast} from "react-toastify"

const UserContext = createContext()
export const useUser = () => useContext(UserContext)

const API_URL = import.meta.env.VITE_API_URL + "/user"

const UserProvider = ({children}) =>{
    const [options , setOptions] = useState(null)

    const setUserOptions = async(options) =>{
        const toastId = toast.loading("Setting optinos...")
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

            toast.update(toastId , {type: "success" , message: data.message , isLoading: false , autoClose: 3000})
            console.log(data)
        }catch(err){
            console.log(err.message)
            toast.update(toastId , {type: "error" , message: "Something went wrong" , isLoading: false , autoClose: 3000})
        }
    }

    return(
        <UserContext.Provider value={{options , setOptions , setUserOptions}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider