export const ProgressSkeleton = () => {
    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl mb-12 border border-slate-200 dark:border-slate-700 animate-pulse">
            <div className="flex justify-between items-end mb-4">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                <div className="h-8 w-16 bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-5 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
                <div className="h-full bg-slate-200 dark:bg-slate-700 w-1/3 opacity-50"></div>
            </div>
        </div>
    )
}

export const TaskSkeleton = () => {
    return (
        <div className="group relative rounded-3xl p-6 flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 animate-pulse">
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-slate-100 to-transparent dark:from-slate-700/40 rounded-bl-[4rem] pointer-events-none"></div>
            <div className="z-10 grow relative">
                <div className="flex items-start justify-between mb-5">
                    <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-16 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                        <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-4 mt-2 mb-2">
                    <div className="flex flex-col gap-3 w-full">
                        <div className="h-7 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        <div className="flex items-center gap-3 mt-1.5">
                            <div className="h-4 w-24 bg-slate-100 dark:bg-slate-700 rounded-md"></div>
                            <div className="h-4 w-16 bg-slate-100 dark:bg-slate-700 rounded-md"></div>
                            <div className="h-5 w-12 bg-slate-100 dark:bg-slate-700 rounded-md"></div>
                        </div>
                    </div>
                    <div className="shrink-0 h-9 w-9 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"></div>
                </div>
            </div>
        </div>
    )
}

export const IdentitySkeleton = () => {
    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 shadow-xl mb-12 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden animate-pulse">
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex flex-col gap-4 text-center md:text-left z-10 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3">
                        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl mx-auto md:mx-0"></div>
                        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-md mx-auto md:mx-0"></div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-w-[120px]">
                        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded-lg"></div>
                    </div>
                </div>
                <div className="mt-4 md:mt-2">
                    <div className="flex justify-between items-end mb-2">
                        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-5 w-16 bg-slate-300 dark:bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                </div>
            </div>
        </div>
    )
}

export const StatCardSkeleton = () => {
    return (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg animate-pulse">
            <div className="flex flex-col h-full justify-between gap-6">
                <div>
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                    <div className="h-8 w-10 bg-slate-300 dark:bg-slate-600 rounded-lg"></div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <div className="h-3 w-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
                        <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-900 rounded-full"></div>
                </div>
            </div>
        </div>
    )
}

export const LeaderboardEntrySkeleton = () => {
    return (
        <div className="relative flex items-center justify-between p-4 md:p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 animate-pulse">
            <div className="flex items-center gap-4 md:gap-6 w-full">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
                <div className="grow flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-8 w-8 bg-slate-300 dark:bg-slate-600 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const FriendCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                <div className="flex flex-col gap-2">
                    <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden sm:block space-y-1">
                    <div className="h-3 w-6 bg-slate-100 dark:bg-slate-800 ml-auto rounded"></div>
                    <div className="h-5 w-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
            </div>
        </div>
    )
}

export const RequestSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse">
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg mb-4"></div>
            <div className="flex gap-2">
                <div className="flex-1 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="flex-1 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
            </div>
        </div>
    )
}

export const TaskSkeletonList = ({ count = 3, includeProgress = true }) => {
    return (
        <div className="w-full flex flex-col items-center">
            {includeProgress && <ProgressSkeleton />}
            <div className="flex flex-col gap-6 w-full">
                {[...Array(count)].map((_, i) => (
                    <TaskSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
