import { useAuth } from "../contexts/authContext"

const Profile = () => {
    const { user } = useAuth()

    if (!user) return null

    const skills = user.skills || {
        body: { xp: 0, rank: "F" },
        mind: { xp: 0, rank: "F" },
        soul: { xp: 0, rank: "F" }
    }

    const StatCard = ({ title, xp, rank, colorFrom, colorTo, shadowColor }) => (
        <div className={`relative group p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-[0_0_20px_${shadowColor}] transition-all duration-300 overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-bl ${colorFrom} to-transparent rounded-bl-[4rem] opacity-20 pointer-events-none transition-colors duration-300`}></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">{title}</h3>
                    <div className={`text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r ${colorFrom} ${colorTo}`}>
                        {rank}
                    </div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-slate-400">EXP</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{xp}</span>
                    </div>
                    {/* Visual bar just for styling, fills to a generic amount given no upper bound context */}
                    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden shadow-inner">
                        <div className={`h-full bg-linear-to-r ${colorFrom} ${colorTo} w-full opacity-60`}></div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 py-12 px-4 transition-colors duration-300 font-sans">
            <div className="max-w-5xl mx-auto flex flex-col items-center">
                
                {/* Header section */}
                <div className="w-full mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-pink-600 to-red-500 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 tracking-tight drop-shadow-sm">
                        Character Sheet
                    </h1>
                </div>

                {/* Player Identity Card */}
                <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-xl mb-12 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    
                    {/* Avatar placeholder */}
                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                        <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border-4 border-transparent">
                            <span className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-purple-500 to-pink-500">
                                {user.username?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 text-center md:text-left z-10 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">{user.username}</h2>
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{user.email}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0 shadow-inner min-w-[120px]">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Overall Rank</span>
                                <span className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-amber-600 drop-shadow-sm">
                                    {user.rank}
                                </span>
                            </div>
                        </div>
                        
                        <div className="mt-4 md:mt-2">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Total EXP</span>
                                <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{user.xp}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Grid */}
                <div className="w-full">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
                        <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                        Skill Attributes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard 
                            title="Body" 
                            xp={skills.body.xp} 
                            rank={skills.body.rank} 
                            colorFrom="from-green-400" 
                            colorTo="to-emerald-600"
                            shadowColor="rgba(52,211,153,0.3)"
                        />
                        <StatCard 
                            title="Mind" 
                            xp={skills.mind.xp} 
                            rank={skills.mind.rank} 
                            colorFrom="from-cyan-400" 
                            colorTo="to-blue-600"
                            shadowColor="rgba(34,211,238,0.3)"
                        />
                        <StatCard 
                            title="Soul" 
                            xp={skills.soul.xp} 
                            rank={skills.soul.rank} 
                            colorFrom="from-pink-400" 
                            colorTo="to-rose-600"
                            shadowColor="rgba(244,114,182,0.3)"
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Profile