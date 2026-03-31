import { createContext , useContext , useState , useEffect } from "react";

const TaskContext = createContext()
export const useTask = () => useContext(TaskContext)

const API_URL = import.meta.env.VITE_API_URL + "/tasks"

const TaskProvider = ({ children }) =>{
    const [tasks , setTasks] = useState([])

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

    return(
        <TaskContext.Provider value={{tasks}}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskProvider