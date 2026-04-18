import { useAuth } from "../../contexts/authContext";
import { Link, useLocation } from "react-router";
import { Home, Users, MessageCircle, Trophy, User, LogOut } from "lucide-react";

const Nav = () => {
    const { user, signout } = useAuth()
    const location = useLocation()

    const navItems = [
        { name: "Quests", path: "/", icon: Home },
        { name: "Friends", path: "/friends", icon: Users },
        { name: "Chat", path: "/chat", icon: MessageCircle },
        { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
        { name: "Profile", path: "/profile", icon: User },
    ]

    return !user ? null : (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between h-18 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <span className="text-white font-black tracking-tighter text-sm">SB</span>
                        </div>
                        <span className="hidden md:block font-black text-xl tracking-tighter text-slate-800 dark:text-white uppercase">Self Betterment</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            const Icon = item.icon
                            return (
                                <Link 
                                    key={item.name} 
                                    to={item.path}
                                    className={`relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-[0.6rem] md:text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                                        isActive 
                                        ? 'text-purple-600 dark:text-purple-400' 
                                        : 'text-slate-500 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-300'
                                    }`}
                                >
                                    <Icon size={18} strokeWidth={isActive ? 3 : 2} className="transition-transform duration-300" />
                                    <span className="hidden lg:block">{item.name}</span>
                                    
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-linear-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                    
                    {/* Sign Out */}
                    <div className="flex items-center">
                        <button 
                            onClick={signout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.6rem] md:text-sm font-black uppercase tracking-wider text-red-500/80 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 cursor-pointer group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
                            <span className="hidden md:block">Leave Game</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Nav