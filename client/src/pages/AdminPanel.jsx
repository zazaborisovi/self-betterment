import { useState, useMemo } from "react";
import { useAdmin } from "../contexts/adminContext";

const AdminPanel = () => {
    const { users } = useAdmin();
    const [searchQuery, setSearchQuery] = useState("");
    const [rankFilter, setRankFilter] = useState("All");
    const [sortBy, setSortBy] = useState("xp-desc");

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        let result = [...users];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(u => 
                u.username.toLowerCase().includes(query) || 
                u.email.toLowerCase().includes(query)
            );
        }

        if (rankFilter !== "All") {
            result = result.filter(u => u.rank === rankFilter);
        }

        result.sort((a, b) => {
            if (sortBy === "xp-desc") return b.xp - a.xp;
            if (sortBy === "xp-asc") return a.xp - b.xp;
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            return 0;
        });

        return result;
    }, [users, searchQuery, rankFilter, sortBy]);

    const ranks = ["All", "S+", "S", "A", "B", "C", "D", "F"];

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 py-12 px-4 transition-colors duration-300 font-sans">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                
                {/* Header section */}
                <div className="w-full mb-10 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-red-500 via-rose-500 to-pink-500 tracking-tight drop-shadow-sm">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium tracking-wide">
                        Manage users, monitor progress, and oversee the platform
                    </p>
                </div>

                {/* Filters & Controls */}
                <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg mb-8 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center z-20 relative">
                    
                    {/* Search Bar */}
                    <div className="w-full md:w-1/3 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search by username or email..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all shadow-inner"
                        />
                    </div>

                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                        {/* Rank Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rank</label>
                            <select 
                                value={rankFilter}
                                onChange={(e) => setRankFilter(e.target.value)}
                                className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 py-3 px-4 pr-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-semibold cursor-pointer"
                            >
                                {ranks.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sort</label>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 py-3 px-4 pr-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 font-semibold cursor-pointer"
                            >
                                <option value="xp-desc">XP (Highest)</option>
                                <option value="xp-asc">XP (Lowest)</option>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users List */}
                <div className="w-full flex flex-col gap-4">
                    <div className="flex justify-between items-end px-4 mb-2">
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            {filteredUsers.length} Users Found
                        </span>
                    </div>

                    {filteredUsers.map((user) => (
                        <div 
                            key={user._id} 
                            className="group relative flex flex-col md:flex-row items-center justify-between p-5 md:p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-rose-400/50 dark:hover:border-rose-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] overflow-hidden"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-rose-500/5 to-pink-500/5 transition-opacity duration-300 pointer-events-none"></div>

                            {/* User Info */}
                            <div className="flex items-center gap-5 w-full md:w-auto mb-4 md:mb-0 z-10">
                                <div className="h-14 w-14 rounded-full bg-linear-to-br from-rose-400 to-pink-600 flex items-center justify-center shrink-0 shadow-md">
                                    <span className="text-xl font-black text-white">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                                            {user.username}
                                        </h3>
                                        {user.role === "admin" && (
                                            <span className="px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-widest rounded-md bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                        {user.email}
                                    </span>
                                </div>
                            </div>

                            {/* User Stats */}
                            <div className="flex items-center justify-between w-full md:w-auto gap-6 sm:gap-12 md:px-8 z-10 border-t md:border-t-0 border-slate-100 dark:border-slate-700/50 pt-4 md:pt-0">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Rank</span>
                                    <span className={`text-2xl font-black ${user.rank.includes('S') ? 'text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-amber-600' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {user.rank}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Total EXP</span>
                                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                        {user.xp.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center hidden sm:flex">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Joined</span>
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Action Placeholder (For Future) */}
                            <div className="z-10 mt-4 md:mt-0 self-end md:self-center">
                                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-sm font-bold rounded-xl transition-colors border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500/30">
                                    Manage
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredUsers.length === 0 && (
                        <div className="w-full p-12 bg-white dark:bg-slate-800 rounded-3xl flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                            <span className="text-4xl mb-4">🔍</span>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No users found</h3>
                            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;