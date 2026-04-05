import { useAuth } from "../../contexts/authContext";
import { Link, useLocation } from "react-router";

const Nav = () =>{
    const {user , signout} = useAuth()
    const location = useLocation()

    const navItems = [
        { name: "Quests", path: "/" },
        { name: "Leaderboard", path: "/leaderboard" },
        { name: "Profile", path: "/profile" },
        { name: "Friends" , path: "/friends"},
    ]

    return !user ? null : (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-500 to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center justify-center">
                            <span className="text-white font-black tracking-tighter text-xs">SB</span>
                        </div>
                    </div>

                    <div className="flex gap-1 sm:gap-4">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link 
                                    key={item.name} 
                                    to={item.path}
                                    className={`px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                                        isActive 
                                        ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>
                    
                    <div className="flex items-center">
                        <button 
                            onClick={signout}
                            className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(248,113,113,0.3)] transition-all duration-300 cursor-pointer"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Nav