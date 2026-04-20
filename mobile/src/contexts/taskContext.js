import {createContext , useContext , useState , useEffect} from "react"
import { useSocket } from "./socketContext"
import { useAuth } from "./authContext"

const TaskContext = createContext()
export const useTask = () => useContext(TaskContext)

const TaskProvider = ({children}) =>{
    const [tasks , setTasks] = useState([])
    const [loading , setLoading] = useState(true)
    const {socket} = useSocket()
    const {user , setUser} = useAuth()

    useEffect(() =>{
        if(!socket || !user) return

        if(!user?.choices || user?.choices?.length <= 0) {
            setLoading(false)
            return
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
    },[socket, user?._id, user?.choices?.length])

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