import { useState } from "react"
import { useFriend } from "../contexts/friendContext"
import { useChat } from "../contexts/chatContext"
import { useAuth } from "../contexts/authContext"
import { useUser } from "../contexts/userContext"
import { useNavigate } from "react-router"
import { UserX, MessageCircle, Inbox, ArrowDownLeft, ArrowUpRight, X, Search, UserPlus, CheckCircle2, Clock } from "lucide-react"

const Friends = () => {
    const { friends, friendRequests, loading, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend, sendFriendRequest } = useFriend()
    const { chats } = useChat()
    const { user } = useAuth()
    const { users } = useUser()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState("friends")
    const [removalModal, setRemovalModal] = useState(null)
    const [addFriendModal, setAddFriendModal] = useState(false)
    const [search, setSearch] = useState("")

    const PendingIncoming = friendRequests?.filter(req => req.to?._id === user?._id || req.to === user?._id)
    const PendingOutgoing = friendRequests?.filter(req => req.from?._id === user?._id || req.from === user?._id)
    const requestCount = (PendingIncoming?.length || 0) + (PendingOutgoing?.length || 0)

    const searchResults = users?.filter(u =>
        u._id !== user?._id &&
        u.username?.toLowerCase().includes(search.toLowerCase())
    ) || []

    const handleRemoveFriend = async () => {
        if (!removalModal) return
        await removeFriend(removalModal.friendshipId)
        setRemovalModal(null)
    }

    const handleMessageFriend = (friendId) => {
        const existingChat = chats.find(c => c.users.includes(friendId))
        if (existingChat) {
            navigate(`/chat/${existingChat._id}`)
        } else {
            navigate(`/chat?newFriendId=${friendId}`)
        }
    }

    const isFriendWith = (userId) => friends?.some(f => f.user1?._id === userId || f.user2?._id === userId)
    const isPendingWith = (userId) => friendRequests?.some(r => r.from?._id === userId || r.to?._id === userId)

    return (
        <div className="min-h-full w-full bg-slate-50 dark:bg-[#0f172a] py-8 px-4 font-sans overflow-y-auto">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-slate-50 mb-1 tracking-tight">Social Hub</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-medium">Connect with fellow seekers</p>
                </div>

                {/* Add Friend Button */}
                <button
                    onClick={() => setAddFriendModal(true)}
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-base px-5 py-3 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 mb-6"
                >
                    <UserPlus size={18} />
                    Add Friend
                </button>

                {/* Tab Switcher */}
                <div className="flex bg-slate-100 dark:bg-[#1e293b] rounded-[18px] p-1 mb-4 border border-slate-200 dark:border-slate-700 gap-1">
                    <button
                        onClick={() => setActiveTab("friends")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-extrabold text-base transition-all ${
                            activeTab === "friends"
                                ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                    >
                        Friends
                        <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                            activeTab === "friends"
                                ? "bg-white/25 text-white"
                                : "bg-slate-200 dark:bg-[#0f172a] text-slate-500 dark:text-slate-400"
                        }`}>
                            {friends?.length || 0}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("requests")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-extrabold text-base transition-all ${
                            activeTab === "requests"
                                ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                    >
                        Requests
                        {requestCount > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                                activeTab === "requests"
                                    ? "bg-white/25 text-white"
                                    : "bg-red-100 dark:bg-red-500/20 text-red-500"
                            }`}>
                                {requestCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : activeTab === "friends" ? (
                    <div className="space-y-3">
                        {friends?.length === 0 ? (
                            <div className="py-12 px-6 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 text-center">
                                <p className="text-slate-400 dark:text-slate-500 text-base">No friends yet. Start competing to grow together!</p>
                            </div>
                        ) : (
                            friends.map((friendship) => {
                                const friend = friendship.user1._id === user?._id ? friendship.user2 : friendship.user1
                                return (
                                    <div key={friendship._id} className="bg-white dark:bg-[#1e293b] p-4 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                        <button
                                            onClick={() => navigate(`/user/${friend._id}`)}
                                            className="flex items-center gap-3 flex-1 text-left"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                                                {friend.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-200 text-base leading-tight">{friend.username}</p>
                                                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Adventurer</p>
                                            </div>
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setRemovalModal({ friendshipId: friendship._id, username: friend.username })}
                                                className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors"
                                            >
                                                <UserX size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleMessageFriend(friend._id)}
                                                className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-400 hover:text-indigo-500 transition-colors"
                                            >
                                                <MessageCircle size={16} />
                                            </button>
                                            <div className="flex flex-col items-center px-2">
                                                <span className="text-[8px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">RANK</span>
                                                <span className="text-lg font-black text-amber-400">{friend.rank || 'F'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {(!PendingIncoming?.length && !PendingOutgoing?.length) ? (
                            <div className="py-12 px-6 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/30 flex flex-col items-center gap-3">
                                <Inbox className="text-slate-300 dark:text-slate-600" size={36} />
                                <p className="text-slate-400 dark:text-slate-500 text-sm italic">No pending requests</p>
                            </div>
                        ) : (
                            <>
                                {PendingIncoming?.length > 0 && (
                                    <>
                                        <div className="flex items-center gap-1.5 px-1 py-2">
                                            <ArrowDownLeft size={14} className="text-green-500" />
                                            <span className="text-[10px] font-black tracking-[1.5px] text-slate-400 dark:text-slate-500 uppercase">Incoming</span>
                                        </div>
                                        {PendingIncoming.map(req => (
                                            <div key={req._id} className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-base">
                                                        {req.from?.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-200">{req.from?.username}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => acceptFriendRequest(req._id)} className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-sm font-bold transition-colors">Accept</button>
                                                    <button onClick={() => rejectFriendRequest(req._id)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-500 rounded-2xl text-sm font-bold transition-colors">Reject</button>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {PendingOutgoing?.length > 0 && (
                                    <>
                                        <div className="flex items-center gap-1.5 px-1 py-2 mt-2">
                                            <ArrowUpRight size={14} className="text-amber-400" />
                                            <span className="text-[10px] font-black tracking-[1.5px] text-slate-400 dark:text-slate-500 uppercase">Sent</span>
                                        </div>
                                        {PendingOutgoing.map(req => (
                                            <div key={req._id} className="bg-slate-50 dark:bg-[#1e293b]/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-base">
                                                        {req.to?.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Sent to</p>
                                                        <p className="font-bold text-slate-800 dark:text-slate-200">{req.to?.username}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => cancelFriendRequest(req._id)} className="w-full py-2.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-2xl text-sm font-bold hover:text-red-500 transition-colors">Cancel</button>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Remove Friend Modal */}
            {removalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm p-8 rounded-[28px] border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center mb-5">
                            <UserX size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-2">Remove Friend?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-center mb-7 text-sm leading-relaxed">
                            Are you sure you want to remove <span className="font-bold text-slate-800 dark:text-slate-200">{removalModal.username}</span> from your friends list?
                        </p>
                        <div className="w-full flex flex-col gap-2.5">
                            <button onClick={handleRemoveFriend} className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-[18px] font-bold text-base shadow-lg shadow-red-500/30 transition-all active:scale-95">Yes, Remove</button>
                            <button onClick={() => setRemovalModal(null)} className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-[18px] font-bold text-base transition-all active:scale-95">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Friend Modal */}
            {addFriendModal && (
                <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-[#0f172a]">
                    <div className="flex items-center justify-between px-5 pt-5 pb-4">
                        <h2 className="text-[28px] font-black text-slate-900 dark:text-slate-50">Add Friend</h2>
                        <button
                            onClick={() => { setAddFriendModal(false); setSearch("") }}
                            className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2.5 mx-5 mb-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-[18px] px-4">
                        <Search size={16} className="text-slate-400 dark:text-slate-500 shrink-0" />
                        <input
                            autoFocus
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by username..."
                            className="flex-1 py-3.5 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 text-sm outline-none"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-2.5">
                        {searchResults.map(u => {
                            const alreadyFriend = isFriendWith(u._id)
                            const pending = isPendingWith(u._id)
                            return (
                                <div key={u._id} className="flex items-center justify-between bg-white dark:bg-[#1e293b] p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-black text-base">
                                            {u.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{u.username}</p>
                                            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{u.role || 'Adventurer'}</p>
                                        </div>
                                    </div>
                                    {alreadyFriend ? (
                                        <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 dark:bg-green-500/10 rounded-xl">
                                            <CheckCircle2 size={14} className="text-green-500" />
                                            <span className="text-xs font-black text-green-600 dark:text-green-400">Friends</span>
                                        </div>
                                    ) : pending ? (
                                        <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                                            <Clock size={14} className="text-amber-500" />
                                            <span className="text-xs font-black text-amber-600 dark:text-amber-400">Pending</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => sendFriendRequest(u._id)}
                                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black rounded-xl transition-colors"
                                        >
                                            Add
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Friends
