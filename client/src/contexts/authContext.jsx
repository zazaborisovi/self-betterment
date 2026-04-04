import {createContext , useContext , useState , useEffect} from "react"
import { toast } from "react-toastify"
import { redirect, useNavigate } from "react-router"

const API_URL = import.meta.env.VITE_API_URL + "/auth"

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const AuthProvider = ({children}) =>{
    const [loading , setLoading] = useState(true)
    const [user , setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() =>{
        (async()=>{
            try{
                const res = await fetch(`${API_URL}/auto-signin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                })

                const data = await res.json()
                
                if(!res.ok) return toast.update(toastId , {type: "error" , message: data.message , isLoading: false , autoClose: 3000})

                setUser(data.user)
            }catch(err){
                console.log(err.message)
            }finally{
                setLoading(false)
            }
        })()
    },[])

    const signup = async(formData) =>{
        const toastId = toast.loading("Signing up...")
        try{
            const res = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include"
            })

            const data = await res.json()

            if(!res.ok) return toast.update(toastId , {type: "error" , message: data.message , isLoading: false , autoClose: 3000})

            toast.update(toastId , {type: "success" , message: data.message , isLoading: false , autoClose: 3000})
            setUser(data.user)
            navigate("/choices")
        }catch(err){
            console.log(err)
            toast.update(toastId , {type: "error" , message: err.message , isLoading: false , autoClose: 3000})
        }
    }
    
    const signin = async(formData) =>{
        const toastId = toast.loading("Signing in...")
        try{
            const res = await fetch(`${API_URL}/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
                credentials: "include"
            })

            const data = await res.json()

            if(!res.ok) return toast.update(toastId , {type: "error" , message: data.message , isLoading: false , autoClose: 3000})

            toast.update(toastId , {type: "success" , message: data.message , isLoading: false , autoClose: 3000})
            setUser(data.user)
            data.user.choices.length > 0 ? navigate("/") : navigate("/choices")
        }catch(err){
            console.log(err)
            toast.update(toastId , {type: "error" , message: "Something went wrong" , isLoading: false , autoClose: 3000})
        }
    }

    const signout = async() =>{
        const toastId = toast.loading("Signing out...")
        try{
            const res = await fetch(`${API_URL}/signout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const data = await res.json()

            if(!res.ok) return toast.update(toastId , {type: "error" , message: data.message , isLoading: false , autoClose: 3000})

            setUser(null)
            toast.update(toastId , {type: "success" , message: data.message , isLoading: false , autoClose: 3000})
            navigate("/")
        }catch(err){
            console.log(err)
            toast.update(toastId , {type: "error" , message: "Something went wrong" , isLoading: false , autoClose: 3000})
        }
    }

    return (
        <AuthContext.Provider value={{user  , setUser, loading , signup , signin , signout}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider