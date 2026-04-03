import { useAuth } from "../contexts/authContext";
import { useTask } from "../contexts/taskContext"

const Main = () =>{
    const {tasks , completeTask} = useTask()
    const {user} = useAuth()
    const progress = 0

    const handleTaskCompletion = async(id) => {
        await completeTask(id)
    }    

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 py-12 px-4 transition-colors duration-300 font-sans">
            <div className="max-w-5xl mx-auto flex flex-col items-center">
                
                {/* Header section representing a quest log or dashboard */}
                <div className="w-full mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-blue-500 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 tracking-tight drop-shadow-sm">
                        Daily Quests
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium tracking-wide">
                        Complete your objectives to level up in life
                    </p>
                </div>

                {/* Progress Bar (Game style XP bar) */}
                <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl mb-12 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Daily Progress EXP</span>
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-blue-500 drop-shadow-sm">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-5 overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800">
                        <div 
                            className="h-full bg-linear-to-r from-indigo-600 via-purple-600 to-blue-500 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 transition-all duration-1000 ease-out relative shadow-[0_0_10px_rgba(147,51,234,0.6)]"
                            style={{ width: `${progress}%` }}
                        >
                            {/* Inner glow effect for progress bar */}
                            <div className="absolute inset-0 bg-white/20"></div>
                        </div>
                    </div>
                </div>

                {/* Tasks Grid */}
                {tasks.length > 0 ? (
                    <div className="flex flex-col gap-6 w-full">
                        {tasks.map((task) => {
                            const isCompleted = task.isCompleted;
                            
                            return (
                                <div 
                                    key={task._id} 
                                    className={`
                                        group relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ease-out overflow-hidden
                                        ${isCompleted 
                                            ? 'bg-slate-100 dark:bg-slate-800/60 border-2 border-green-500/30 opacity-80'
                                            : 'bg-white dark:bg-slate-800 shadow-lg hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:-translate-y-2 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 cursor-pointer'
                                        }
                                    `}
                                >
                                    {/* Subtle background glow effect on hover for active items */}
                                    {!isCompleted && (
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-br from-purple-500/5 to-indigo-500/5 transition-opacity duration-300 pointer-events-none"></div>
                                    )}

                                    {/* Graphic element in corner */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-slate-100 to-transparent dark:from-slate-700/40 rounded-bl-[4rem] pointer-events-none transition-colors duration-300"></div>
                                    
                                    <div className="z-10 flex-grow relative">
                                        <div className="flex items-start justify-between mb-5">
                                            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${isCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800'}`}>
                                                {isCompleted ? 'Complete' : 'Active'}
                                            </span>
                                            {isCompleted ? (
                                                <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 drop-shadow-sm" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                    <span>In Progress</span>
                                                    <span className="flex h-2 w-2 relative">
                                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center justify-between gap-4 mt-2 mb-2">
                                            <h3 className={`text-xl font-bold transition-colors duration-300 ${isCompleted ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-400/50' : 'text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400'}`}>
                                                {task.task}
                                            </h3>
                                            {isCompleted ? (
                                                <button 
                                                    onClick={() => handleTaskCompletion(task._id)}
                                                    className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 active:scale-95 cursor-pointer"
                                                >
                                                    Not Done
                                                </button>
                                            ) : (
                                                <div onClick={() => handleTaskCompletion(task._id)} className="flex-shrink-0 h-9 w-9 rounded-xl border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300 active:scale-75 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] group/check">
                                                    <svg className="w-5 h-5 text-purple-500 opacity-0 scale-0 group-hover/check:opacity-100 group-hover/check:scale-110 transition-all duration-300 ease-out origin-center" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="w-full p-16 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 mb-3">No Active Quests</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">Your quest log is currently empty. Head over to the choices section to generate new daily missions!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Main