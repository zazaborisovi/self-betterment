import { useParams, useNavigate } from "react-router";
import { useUser } from "../contexts/userContext";
import { useFriend } from "../contexts/friendContext";
import { useAuth } from "../contexts/authContext";
import { useChat } from "../contexts/chatContext";
import { IdentitySkeleton, StatCardSkeleton } from "./components/Skeletons";
import { useEffect, useState } from "react";

const UserPage = () => {
    const { id } = useParams()
    const { getUserProfile } = useUser()
    const { sendFriendRequest, friends, friendRequests, loading: friendLoading } = useFriend()
    const { chats } = useChat()
    const { user: currentUser } = useAuth()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    
    
    useEffect(() => {
        (async () => {
            setLoading(true)
            const data = await getUserProfile(id)
            setProfile(data)
            setLoading(false)
        })()
    }, [id])
    
    const skills = profile?.skills || {
        body: { xp: 0, rank: "F" },
        mind: { xp: 0, rank: "F" },
        soul: { xp: 0, rank: "F" }
    }
    
    const isFriend = friends?.some(f => f.user1?._id === profile?._id || f.user2?._id === profile?._id)
    const isRequestPending = friendRequests?.some(r => r.from?._id === profile?._id || r.to?._id === profile?._id)
    const isSelf = currentUser?._id === profile?._id

    const handleChat = () => {
        const chat = chats?.find(c => c.otherUser?._id === profile?._id)
        if (chat) {
            navigate(`/chat/${chat._id}`)
        } else {
            navigate(`/chat?newFriendId=${profile?._id}`)
        }
    }


    const StatCard = ({ title, xp, maxXp, rank, colorFrom, colorTo, shadowColor }) => (
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
                ) : !profile ? (
                    <div className="text-center space-y-4 py-20">
                        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100">User Not Found</h1>
                        <p className="text-slate-500 dark:text-slate-400">The character you are looking for does not exist.</p>
                    </div>
                ) : (
                    <>
                        {/* Player Identity Card */}
                        <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-xl mb-12 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

                            {/* Avatar placeholder */}
                            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                                <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border-4 border-transparent">
                                    <span className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-purple-500 to-pink-500">
                                        {profile.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 text-center md:text-left z-10 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100">{profile.username}</h2>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-1">Adventurer</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shrink-0 shadow-inner min-w-30">
                                        <span className="text-[0.65rem] font-black uppercase tracking-widest text-slate-500 mb-1">Overall Rank</span>
                                        <span className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-amber-600 drop-shadow-sm">
                                            {profile.rank}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-col md:flex-row items-center gap-6">
                                    <div className="grow w-full">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Total EXP</span>
                                            <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{profile.xp.current / profile.xp.max * 100}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-2 overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800">
                                            <div className="h-full bg-linear-to-r from-purple-500 to-pink-500 w-full opacity-60" style={{width: `${profile.xp.current / profile.xp.max * 100}%`}} />
                                        </div>
                                    </div>

                                    {/* Friend Actions */}
                                    {!isSelf && (
                                        <div className="shrink-0 w-full md:w-auto">
                                            {isFriend ? (
                                                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                                    <button disabled className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold cursor-default flex items-center justify-center gap-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        Friends
                                                    </button>
                                                    <button 
                                                        onClick={handleChat}
                                                        className="px-6 py-3 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors flex items-center justify-center gap-2 border border-purple-200 dark:border-purple-800"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                                        Message
                                                    </button>
                                                </div>
                                            ) : isRequestPending ? (
                                                <button disabled className="w-full md:w-auto px-6 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold cursor-default flex items-center justify-center gap-2 border border-amber-200 dark:border-amber-900/50">
                                                    Pending
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => sendFriendRequest(profile._id)}
                                                    className="w-full md:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg shadow-purple-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                                    </svg>
                                                    Add Friend
                                                </button>
                                            )}
                                        </div>
                                    )}
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

export default UserPage;