

const ProfilePicture = ({ user }) => {
    return (
        <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border-4 border-transparent overflow-hidden">
                <img 
                    src={user?.profilePicture?.url} 
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
    )
}

export default ProfilePicture