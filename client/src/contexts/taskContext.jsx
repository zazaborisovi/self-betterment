import { createContext , useContext , useState , useEffect } from "react";
import { useAuth } from "./authContext";
import { useSocket } from "./socketContext";

const TaskContext = createContext()
export const useTask = () => useContext(TaskContext)

const API_URL = import.meta.env.VITE_API_URL + "/tasks"

const TaskProvider = ({ children }) =>{
    const [tasks , setTasks] = useState([])
    const {socketRef} = useSocket()
    const {user , setUser} = useAuth()

    useEffect(() =>{
        const socket = socketRef.current

        if(!socket) return

        socket.on("task-completed" , (data) =>{
            setTasks(data.taskObj.tasks)
            setUser(prev => ({...prev , ...data.update}))
        })
    },[socketRef])

    useEffect(() =>{
        (async() =>{
            try{
                let res = await fetch(API_URL + "/" , {
                    method : 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials : 'include'
                })
                let data = await res.json()

                let recordDate = null
                let today = null

                if(data.success){
                    recordDate = new Date(data?.taskObj?.createdAt).toISOString().split('T')[0]
                    today = new Date().toISOString().split('T')[0]
                }

                console.log(recordDate , today)

                if(!data.success || (recordDate && (recordDate != today))){
                    res = await fetch(API_URL + "/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include"
                    })
                    data = await res.json()
                }

                if(!res.ok) return console.log(data.message)

                setTasks(data.taskObj.tasks)
            }catch(err){
                console.log(err)
            }
        })()
    },[])

    const completeTask = async(id) =>{
        socketRef.current.emit("complete-task" , {taskId: id})
    }

    return(
        <TaskContext.Provider value={{tasks , completeTask}}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskProvider