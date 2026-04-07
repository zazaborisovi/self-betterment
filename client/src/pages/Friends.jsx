import { useAuth } from "../contexts/authContext"
import { useFriend } from "../contexts/friendContext"
import { useNavigate } from "react-router"
import { useState, useEffect, useRef } from "react"

const Friends = () => {
    const { friends, friendRequests, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend } = useFriend()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [activeMenu, setActiveMenu] = useState(null)
    const [removalModal, setRemovalModal] = useState(null)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleAccept = (requestId) => {
        acceptFriendRequest(requestId)
    }

    const handleReject = (requestId) => {
        rejectFriendRequest(requestId)
    }

    const handleCancel = (requestId) => {
        cancelFriendRequest(requestId)
    }

    const handleRemoveFriend = () => {
        if (removalModal) {
            removeFriend(removalModal._id)
            setRemovalModal(null)
            setActiveMenu(null)
        }
    }

    const PendingIncoming = friendRequests?.filter(req => req.to._id === user?._id)
    const PendingOutgoing = friendRequests?.filter(req => req.from._id === user?._id)

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 py-12 px-4 transition-colors duration-300 font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* Header section */}
                <div className="w-full mb-12 text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-500 to-purple-500 tracking-tight drop-shadow-sm">
                        Social Hub
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium tracking-wide">
                        Connect with fellow seekers of self-betterment
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Friends List - Takes 2/3 of space on large screens */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                                Friends ({friends?.length || 0})
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {friends?.map((friendship) => {
                                const friend = friendship.user1._id === user?._id ? friendship.user2 : friendship.user1;
                                return (
                                    <div 
                                        key={friendship._id}
                                        className="group relative bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer"
                                        onClick={() => navigate(`/user/${friend._id}`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
                                                {friend.username[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">
                                                    {friend.username}
                                                </span>
                                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                    Rank {friend.rank || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">XP</div>
                                                <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{friend.xp || 0}</div>
                                            </div>
                                            
                                            {/* Ellipsis Menu Button */}
                                            <div className="relative" ref={activeMenu === friendship._id ? menuRef : null}>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveMenu(activeMenu === friendship._id ? null : friendship._id);
                                                    }}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                                                </button>

                                                {/* Dropdown Menu */}
                                                {activeMenu === friendship._id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-20 overflow-hidden backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95 animate-in fade-in zoom-in duration-200">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setRemovalModal({ _id: friendship._id, username: friend.username });
                                                                setActiveMenu(null);
                                                            }}
                                                            className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                                            Remove Friend
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {(!friends || friends.length === 0) && (
                                <div className="col-span-full py-12 px-6 bg-slate-100/50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">No friends yet. Start competing to grow together!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Requests Sidebar - Takes 1/3 of space on large screens */}
                    <div className="space-y-6">
                        <div className="flex items-center mb-4 px-2">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                                Requests
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {/* Incoming Requests */}
                            {PendingIncoming?.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Incoming</h3>
                                    {PendingIncoming.map((request) => (
                                        <div key={request._id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <p className="text-slate-700 dark:text-slate-300 font-bold mb-3 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                {request.from.username}
                                            </p>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleAccept(request._id)}
                                                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                                                >
                                                    Accept
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(request._id)}
                                                    className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-sm font-bold transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Outgoing Requests */}
                            {PendingOutgoing?.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Sent</h3>
                                    {PendingOutgoing.map((request) => (
                                        <div key={request._id} className="bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                                            <p className="text-slate-600 dark:text-slate-400 font-medium mb-3">
                                                To: <span className="font-bold text-slate-800 dark:text-slate-200">{request.to.username}</span>
                                            </p>
                                            <button 
                                                onClick={() => handleCancel(request._id)}
                                                className="w-full py-2 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold transition-all shadow-sm"
                                            >
                                                Cancel Request
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {(!friendRequests || friendRequests.length === 0) && (
                                <div className="py-8 px-4 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">No pending requests</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Confirmation Modal */}
            {removalModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md p-8 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center text-red-600 dark:text-red-400 mb-6 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white text-center mb-2">Remove Friend?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-center mb-8 font-medium">
                            Are you sure you want to remove <span className="font-bold text-slate-700 dark:text-slate-200">{removalModal.username}</span> from your friends list?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={handleRemoveFriend}
                                className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95"
                            >
                                Yes, Remove
                            </button>
                            <button 
                                onClick={() => setRemovalModal(null)}
                                className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-2xl font-bold transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Friends