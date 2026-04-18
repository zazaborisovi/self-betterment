import { createContext , useContext , useState , useEffect } from "react";
import { useAuth } from "./authContext";
import { useSocket } from "./socketContext";
import { useNavigate } from "react-router";

const TaskContext = createContext()
export const useTask = () => useContext(TaskContext)

const API_URL = import.meta.env.VITE_API_URL + "/tasks"

const TaskProvider = ({ children }) =>{
    const [tasks , setTasks] = useState([])
    const [loading , setLoading] = useState(true)
    const {socket} = useSocket()
    const {user , setUser} = useAuth()
    const navigate = useNavigate()

    useEffect(() =>{
        if(!socket || !user) return

        if(user?.choices?.length <= 0) {
            return navigate("/choices")
        }

        setLoading(true)
        socket.emit("get-tasks")

        const handleTasks = (data) =>{
            setTasks(data?.taskObj?.tasks)
            setLoading(false)
        }

        socket.on("tasks" , handleTasks)

        return () =>{
            socket.off("tasks" , handleTasks)
        }
    },[socket, user?._id])

    useEffect(() =>{
        if(!socket) return

        const handleTaskCompletion = (data) =>{
            setTasks(data.taskObj.tasks)
            setUser(prev => ({...prev , ...data.update}))
        }

        socket.on("task-completed" , handleTaskCompletion)

        return () =>{
            socket.off("task-completed" , handleTaskCompletion)
        }
    },[socket])


    const completeTask = async(id) =>{
        if (!socket) return
        socket.emit("complete-task" , {taskId: id})
    }

    return(
        <TaskContext.Provider value={{tasks , completeTask , loading}}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskProvider