import { useTask } from "../contexts/taskContext"

const Main = () =>{
    const {tasks} = useTask()
    return (
        <div>
            {tasks.map((task) => (
                <div key={task._id}>
                    <p>{task.task}</p>
                    <p>{task.isCompleted ? "Completed" : "Not Completed"}</p>
                </div>
            ))}
        </div>
    )
}

export default Main