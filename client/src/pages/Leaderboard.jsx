import { useNavigate } from "react-router"
import { useLeaderboard } from "../contexts/leaderboardContext"

const Leaderboard = () => {
    const navigate = useNavigate()
    const { leaderboard } = useLeaderboard()
    
    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 py-12 px-4 transition-colors duration-300 font-sans">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
                
                {/* Header section */}
                <div className="w-full mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-amber-500 to-orange-500 tracking-tight drop-shadow-sm">
                        Hall of Fame
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium tracking-wide">
                        Global Rankings & Top Achievers
                    </p>
                </div>

                {/* Leaderboard Cards Grid */}
                <div className="w-full flex flex-col gap-4">
                    {leaderboard?.map((user, index) => {
                        const isTop3 = index < 3;
                        let rankGlow = '';
                        let rankTextColors = '';
                        let positionBadgeColor = '';

                        if (index === 0) {
                            rankGlow = 'hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] border-yellow-200 dark:border-yellow-900/50 hover:border-yellow-400';
                            rankTextColors = 'from-yellow-400 to-amber-600';
                            positionBadgeColor = 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
                        } else if (index === 1) {
                            rankGlow = 'hover:shadow-[0_0_20px_rgba(148,163,184,0.3)] border-slate-300 dark:border-slate-700 hover:border-slate-400';
                            rankTextColors = 'from-slate-400 to-slate-500';
                            positionBadgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                        } else if (index === 2) {
                            rankGlow = 'hover:shadow-[0_0_20px_rgba(217,119,6,0.3)] border-orange-200 dark:border-orange-900/40 hover:border-orange-400';
                            rankTextColors = 'from-orange-400 to-amber-700';
                            positionBadgeColor = 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400';
                        } else {
                            rankGlow = 'hover:shadow-[0_0_15px_rgba(147,51,234,0.2)] border-slate-200 dark:border-slate-800 hover:border-purple-400/50';
                            rankTextColors = 'from-slate-700 to-slate-500 dark:from-slate-300 dark:to-slate-400';
                            positionBadgeColor = 'bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-500';
                        }

                        return (
                            <div 
                                key={user._id}
                                className={`relative group flex items-center justify-between p-4 md:p-6 bg-white dark:bg-slate-800 rounded-3xl border transition-all duration-300 cursor-default overflow-hidden ${rankGlow}`}
                            >
                                {/* Position Badge */}
                                <div className="flex items-center gap-4 md:gap-6 z-10 w-full">
                                    <div className={`w-12 h-12 md:w-14 md:h-14 font-black text-xl md:text-2xl rounded-2xl flex items-center justify-center shrink-0 ${positionBadgeColor}`}>
                                        #{index + 1}
                                    </div>
                                    
                                    <div className="flex-grow flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px] sm:max-w-[300px]" onClick={() => navigate(`/user/${user._id}`)}>
                                                {user.username}
                                            </span>
                                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                                                {user.xp} EXP
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Rank</span>
                                            <span className={`text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r ${rankTextColors}`}>
                                                {user.rank}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {isTop3 && (
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-bl ${rankTextColors.replace('from-', 'from-').replace('to-', 'to-')} rounded-bl-full opacity-5 pointer-events-none transition-colors duration-300`}></div>
                                )}
                            </div>
                        )
                    })}

                    {(!leaderboard || leaderboard.length === 0) && (
                        <div className="w-full p-16 bg-white dark:bg-slate-800 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 mb-2">The Hall is Empty</h2>
                            <p className="text-slate-500 dark:text-slate-400">No champions have risen yet. Start completing quests!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Leaderboard