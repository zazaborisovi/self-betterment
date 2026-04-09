import { createContext , useContext , useState , useEffect } from "react";
import { toast } from "react-toastify";


const AdminContext = createContext()
export const useAdmin = () => useContext(AdminContext)

const API_URL = import.meta.env.VITE_API_URL + "/admin"

const AdminProvider = ({children}) =>{
    const [users , setUsers] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        (async() =>{
            setLoading(true)
            try{
                const res = await fetch(API_URL , {method: "GET" , credentials: "include"})
                const data = await res.json()

                if(!res.ok) {
                    toast.error(data.message)
                    return
                }

                setUsers(data.users)
            }catch(err){
                toast.error(err.message)
            } finally {
                setLoading(false)
            }
        })()
    },[])

    return(
        <AdminContext.Provider value={{users, loading}}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminProvider