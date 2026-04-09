import { useAuth } from "../contexts/authContext"
import { useTask } from "../contexts/taskContext"
import { TaskSkeletonList } from "../pages/components/Skeletons"

const Main = () => {
    const { user } = useAuth()
    const { tasks, completeTask, loading } = useTask()
    const progress = user.xp.current / user.xp.max * 100

    const handleTaskCompletion = async (id) => {
        await completeTask(id.toString())
    }

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-slate-900 py-8 px-4 transition-colors duration-300 font-sans overflow-y-auto custom-scrollbar">
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

                {/* Main Content Area */}
                {loading ? (
                    <TaskSkeletonList count={3} />
                ) : (
                    <>
                        {/* Progress Bar (Game style XP bar) */}
                        <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl mb-12 border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Progress</span>
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

                                            <div className="z-10 grow relative">
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
                                                    <div className="flex flex-col">
                                                        <h3 className={`text-xl font-bold transition-colors duration-300 ${isCompleted ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-400/50' : 'text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400'}`}>
                                                            {task.task}
                                                        </h3>

                                                        {/* Task Details Row */}
                                                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                            {task.quantity && task.unit && (
                                                                <span className={`text-sm font-semibold ${isCompleted ? 'text-slate-400/60 dark:text-slate-500/60 line-through' : 'text-slate-600 dark:text-slate-300'}`}>
                                                                    {task.quantity} {task.unit}
                                                                </span>
                                                            )}
                                                            {task.xpValue && (
                                                                <span className={`flex items-center gap-1 text-sm font-bold ${isCompleted ? 'text-amber-500/50 dark:text-amber-400/50' : 'text-amber-500 dark:text-amber-400'}`}>
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                                                    {task.xpValue} XP
                                                                </span>
                                                            )}
                                                            {task.category && (
                                                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border tracking-wider ${isCompleted
                                                                        ? 'border-slate-300/50 text-slate-400/50 dark:border-slate-600/50 dark:text-slate-500/50'
                                                                        : task.category === 'body'
                                                                            ? 'border-red-200 text-red-600 dark:border-red-900/30 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
                                                                            : task.category === 'mind'
                                                                                ? 'border-blue-200 text-blue-600 dark:border-blue-900/30 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                                                                                : 'border-purple-200 text-purple-600 dark:border-purple-900/30 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10'
                                                                    }`}>
                                                                    {task.category}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isCompleted ? (
                                                        <div
                                                            onClick={() => handleTaskCompletion(task._id)}
                                                            className="shrink-0 h-9 w-9 rounded-xl border-2 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/20 flex items-center justify-center cursor-pointer hover:bg-red-100 hover:border-red-400 dark:hover:bg-red-500/20 dark:hover:border-red-500 transition-all duration-300 active:scale-75 group/uncheck"
                                                            title="Cancel Completion"
                                                        >
                                                            <svg className="w-5 h-5 text-red-500 animate-[pulse_0.5s_cubic-bezier(0.4,0,0.6,1)_1] group-hover/uncheck:scale-125 group-hover/uncheck:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            onClick={() => handleTaskCompletion(task._id)}
                                                            className="shrink-0 h-9 w-9 rounded-xl border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-300 active:scale-75 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] group/check"
                                                            title="Complete Task"
                                                        >
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
                    </>
                )}
            </div>
        </div>
    )
}

export default Main