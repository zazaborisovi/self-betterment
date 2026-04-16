import { useAuth } from "../contexts/authContext"
import { IdentitySkeleton, StatCardSkeleton } from "./components/Skeletons"
import { useUser } from "../contexts/userContext"
import { useRef, useState } from "react"

const Profile = () => {
    const { user, loading } = useAuth()
    const { changeProfilePicture } = useUser()

    const fileInputRef = useRef(null)
    const [preview , setPreview] = useState(user?.profilePicture?.url)

    const skills = user?.skills || {
        body: { xp: 0, rank: "F" },
        mind: { xp: 0, rank: "F" },
        soul: { xp: 0, rank: "F" }
    }

    const handleUploadPhoto = (e) =>{
        const file = e.target.files[0]
        if(file){
            setPreview(URL.createObjectURL(file))
            changeProfilePicture(file)
        }
    }

    const handleClick = () =>{
        fileInputRef.current.click()
    }

    const StatCard = ({ title, xp, maxXp , rank, colorFrom, colorTo, shadowColor }) => (
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
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{xp} / {maxXp}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden shadow-inner">
                        <div className={`h-full bg-linear-to-r ${colorFrom} ${colorTo} opacity-60`} style={{width: `${xp / maxXp * 100}%`}} />
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-slate-900 py-8 px-4 transition-colors duration-300 font-sans overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto flex flex-col items-center">

                {/* Header section */}
                <div className="w-full mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-pink-600 to-red-500 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 tracking-tight drop-shadow-sm">
                        Character Sheet
                    </h1>
                </div>

                {loading ? (
                    <div className="w-full">
                        <IdentitySkeleton />
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
                            <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
                            Skill Attributes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Player Identity Card */}
                        <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-xl mb-12 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

                            {/* profile picture */}
                            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                                <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border-4 border-transparent overflow-hidden">
                                    <input 
                                        type="file" 
                                        onChange={handleUploadPhoto}
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                    <div 
                                        onClick={handleClick} 
                                        className="relative group w-full h-full cursor-pointer"
                                    >
                                        <img 
                                            src={preview} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        />
                                        
                                        {/* The Enhanced Overlay */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-[2px] opacity-0 transition-all duration-300 group-hover:opacity-100">
                                            <svg 
                                                className="w-6 h-6 text-white mb-1" 
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="text-[10px] font-black uppercase tracking-tighter text-white text-center px-2">
                                                Update <br/> Identity
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 text-center md:text-left z-10 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">{user?.username}</h2>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1">Adventurer</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0 shadow-inner min-w-30">
                                        <span className="text-[0.65rem] font-black uppercase tracking-widest text-slate-500 mb-1">Overall Rank</span>
                                        <span className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-amber-600 drop-shadow-sm">
                                            {user?.rank}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-2">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Total EXP</span>
                                        <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{user?.xp.current} / {user?.xp.max}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800">
                                        <div
                                            className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                                            style={{ width: `${(user?.xp.current / user?.xp.max) * 100}%` }}
                                        ></div>
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
                                    xp={skills.body.xp.current}
                                    maxXp={skills.body.xp.max}
                                    rank={skills.body.rank}
                                    colorFrom="from-green-400"
                                    colorTo="to-emerald-600"
                                    shadowColor="rgba(52,211,153,0.3)"
                                />
                                <StatCard
                                    title="Mind"
                                    xp={skills.mind.xp.current}
                                    maxXp={skills.mind.xp.max}
                                    rank={skills.mind.rank}
                                    colorFrom="from-cyan-400"
                                    colorTo="to-blue-600"
                                    shadowColor="rgba(34,211,238,0.3)"
                                />
                                <StatCard
                                    title="Soul"
                                    xp={skills.soul.xp.current}
                                    maxXp={skills.soul.xp.max}
                                    rank={skills.soul.rank}
                                    colorFrom="from-pink-400"
                                    colorTo="to-rose-600"
                                    shadowColor="rgba(244,114,182,0.3)"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Profile