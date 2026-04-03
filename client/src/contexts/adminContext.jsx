import { createContext , useContext , useState , useEffect } from "react";
import { toast } from "react-toastify";

const AdminContext = createContext()
export const useAdmin = () => useContext(AdminContext)

const API_URL = import.meta.env.VITE_API_URL + "/admin"

const AdminProvider = ({children}) =>{
    const [users , setUsers] = useState(null)

    useEffect(() =>{
        (async() =>{
            const toastId = toast.loading("Loading users...")
            try{
                const res = await fetch(API_URL , {method: "GET" , credentials: "include"})
                const data = await res.json()

                if(!res.ok) return toast.update(toastId , {render: data.message , type: "error" , autoClose: 2000})

                setUsers(data.users)
            }catch(err){
                return toast.update(toastId , {render: err.message , type: "error" , autoClose: 2000})
            }
        })()
    },[])

    return(
        <AdminContext.Provider value={{users}}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminProvider