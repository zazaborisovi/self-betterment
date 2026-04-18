import { useAuth } from "../contexts/authContext"
import { IdentitySkeleton, StatCardSkeleton } from "./components/Skeletons"
import { useUser } from "../contexts/userContext"
import { useRef, useState } from "react"
import { Dumbbell, Brain, Heart, Camera, Trophy, LogOut, Flame } from "lucide-react"

const Profile = () => {
    const { user, loading, signout } = useAuth()
    const { changeProfilePicture } = useUser()

    const fileInputRef = useRef(null)
    const [preview , setPreview] = useState(user?.profilePicture?.url)

    const skills = user?.skills || {
        body: { xp: { current: 0, max: 100 }, rank: "F" },
        mind: { xp: { current: 0, max: 100 }, rank: "F" },
        soul: { xp: { current: 0, max: 100 }, rank: "F" }
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

    const StatCard = ({ title, xp, maxXp , rank, colorFrom, colorTo, shadowColor, Icon }) => (
        <div className={`relative group p-6 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-[0_0_30px_${shadowColor}] transition-all duration-500 overflow-hidden`}>
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-linear-to-bl ${colorFrom} to-transparent rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">{title}</h3>
                        <div className={`text-5xl font-black text-transparent bg-clip-text bg-linear-to-br ${colorFrom} ${colorTo} drop-shadow-sm`}>
                            {rank}
                        </div>
                    </div>
                    <div className={`p-3 rounded-2xl bg-linear-to-br ${colorFrom} ${colorTo} shadow-lg opacity-80 group-hover:opacity-100 transition-opacity duration-500`}>
                        <Icon className="text-white" size={20} />
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">EXP PROGRESS</span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">{xp} / {maxXp}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-900/50 rounded-full h-2.5 overflow-hidden shadow-inner border border-slate-200/50 dark:border-slate-700/50">
                        <div 
                            className={`h-full bg-linear-to-r ${colorFrom} ${colorTo} shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-1000 ease-out`} 
                            style={{width: `${(xp / maxXp) * 100}%`}} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-slate-900 py-12 px-4 transition-colors duration-500 font-sans overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto flex flex-col items-center">

                {/* Header section */}
                <div className="w-full mb-16 text-center space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 tracking-tighter drop-shadow-xl uppercase">
                        Character Sheet
                    </h1>
                    <div className="h-1.5 w-32 bg-linear-to-r from-indigo-500 to-pink-500 mx-auto rounded-full blur-[1px]"></div>
                    
                    <button 
                        onClick={signout}
                        className="mt-6 mx-auto flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all duration-300 font-bold uppercase tracking-widest text-xs group active:scale-95"
                    >
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Leave Game
                    </button>
                </div>

                {loading ? (
                    <div className="w-full">
                        <IdentitySkeleton />
                        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-12 mb-8 uppercase tracking-tighter">
                            Skill Attributes
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Player Identity Card - Refined Mobile Style */}
                        <div className="w-full bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl mb-16 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
                            {/* Animated Background Accents */}
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

                            {/* Profile Picture Section */}
                            <div className="relative">
                                <div className="w-40 h-40 md:w-48 md:h-48 shrink-0 rounded-[3rem] bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-1.5 shadow-[0_20px_50px_rgba(168,85,247,0.3)] transform transition-transform duration-500 group-hover:rotate-2">
                                    <div className="w-full h-full rounded-[2.7rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center border-4 border-transparent overflow-hidden relative">
                                        <input 
                                            type="file" 
                                            onChange={handleUploadPhoto}
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*"
                                        />
                                        <div 
                                            onClick={handleClick} 
                                            className="relative group/avatar w-full h-full cursor-pointer"
                                        >
                                            {preview ? (
                                                <img 
                                                    src={preview} 
                                                    alt="Profile" 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                                                    <span className="text-6xl font-black text-purple-500">{user?.username?.charAt(0).toUpperCase()}</span>
                                                </div>
                                            )}
                                            
                                            {/* Enhanced Overlay */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm opacity-0 transition-all duration-300 group-hover/avatar:opacity-100">
                                                <Camera className="text-white mb-2" size={32} />
                                                <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-white text-center">
                                                    Update <br/> Identity
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Rank Tag */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-linear-to-r from-amber-400 to-orange-600 text-white font-black text-xs shadow-lg uppercase tracking-widest border-2 border-white dark:border-slate-800">
                                    Rank {user?.rank}
                                </div>
                            </div>

                            {/* User Info Details */}
                            <div className="flex flex-col gap-6 text-center md:text-left z-10 w-full">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div className="space-y-1">
                                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">{user?.username}</h2>
                                        <p className="text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs">Professional Adventurer</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 shrink-0 shadow-inner backdrop-blur-sm min-w-32 group/rank">
                                        <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Overall Tier</span>
                                        <span className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-yellow-400 via-orange-500 to-amber-600 drop-shadow-md group-hover/rank:scale-110 transition-transform duration-300">
                                            {user?.rank}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-slate-400">Character Evolution</span>
                                        <span className="text-2xl font-black text-slate-700 dark:text-slate-100 tracking-tighter">{user?.xp.current} <span className="text-slate-400 text-sm">/ {user?.xp.max}</span></span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-900/80 rounded-full h-3 overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800">
                                        <div
                                            className="h-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                            style={{ width: `${(user?.xp.current / user?.xp.max) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills Grid */}
                        <div className="w-full">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-10 flex items-center gap-4 uppercase tracking-tighter">
                                <span className="w-12 h-1.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"></span>
                                Skill Attributes
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <StatCard
                                    title="Physical Body"
                                    xp={skills.body.xp.current}
                                    maxXp={skills.body.xp.max}
                                    rank={skills.body.rank}
                                    colorFrom="from-emerald-400"
                                    colorTo="to-teal-600"
                                    shadowColor="rgba(52,211,153,0.3)"
                                    Icon={Dumbbell}
                                />
                                <StatCard
                                    title="Mental Mind"
                                    xp={skills.mind.xp.current}
                                    maxXp={skills.mind.xp.max}
                                    rank={skills.mind.rank}
                                    colorFrom="from-cyan-400"
                                    colorTo="to-blue-600"
                                    shadowColor="rgba(34,211,238,0.3)"
                                    Icon={Brain}
                                />
                                <StatCard
                                    title="Ethereal Soul"
                                    xp={skills.soul.xp.current}
                                    maxXp={skills.soul.xp.max}
                                    rank={skills.soul.rank}
                                    colorFrom="from-rose-400"
                                    colorTo="to-pink-600"
                                    shadowColor="rgba(244,114,182,0.3)"
                                    Icon={Heart}
                                />
                            </div>
                        </div>

                        {/* Streak Section */}
                        <div className="w-full mt-12 mb-10">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-4 uppercase tracking-tighter">
                                <span className="w-12 h-1.5 bg-linear-to-r from-orange-500 to-red-500 rounded-full"></span>
                                Consistency Streak
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-6 group hover:shadow-orange-500/10 transition-all">
                                    <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner group-hover:scale-110 transition-transform">
                                        <Flame size={32} fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Current Streak</p>
                                        <p className="text-4xl font-black text-slate-800 dark:text-white">{user?.streak?.currentStreak || 0} <span className="text-xl text-orange-500 tracking-tighter">DAYS</span></p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-6 group hover:shadow-amber-500/10 transition-all">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-110 transition-transform">
                                        <Trophy size={32} />
                                    </div>
                                    <div>
                                        <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Best Streak</p>
                                        <p className="text-4xl font-black text-slate-800 dark:text-white">{user?.streak?.longestStreak || 0} <span className="text-xl text-amber-500 tracking-tighter">DAYS</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Profile