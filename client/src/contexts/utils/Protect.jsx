import { useEffect } from "react"
import { useAuth } from "../authContext"
import { useNavigate, Outlet, useLocation } from "react-router"
import { 
    TaskSkeletonList, 
    IdentitySkeleton, 
    StatCardSkeleton, 
    LeaderboardEntrySkeleton, 
    FriendCardSkeleton 
} from "../../pages/components/Skeletons"

const Protect = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user)
      navigate("/signin")
  }, [loading, user, navigate])

  const renderSkeleton = () => {
    const path = location.pathname

    if (path === "/profile") {
      return (
        <div className="w-full">
            <IdentitySkeleton />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
        </div>
      )
    }

    if (path === "/leaderboard") {
      return (
        <div className="w-full flex flex-col gap-4">
            {[...Array(5)].map((_, i) => <LeaderboardEntrySkeleton key={i} />)}
        </div>
      )
    }

    if (path === "/friends") {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {[...Array(4)].map((_, i) => <FriendCardSkeleton key={i} />)}
                </div>
                <div className="hidden lg:block h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
            </div>
        )
    }

    // Default for / or other routes
    return <TaskSkeletonList count={3} />
  }

  if (loading) return (
    <div className="h-full w-full bg-slate-50 dark:bg-slate-900 py-8 px-4 transition-colors duration-300 font-sans overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Simplified header placeholder */}
        <div className="w-full mb-12 text-center space-y-4 animate-pulse">
          <div className="h-12 w-64 bg-slate-200 dark:bg-slate-700 rounded-2xl mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-slate-100 dark:bg-slate-800 rounded-xl mx-auto"></div>
        </div>
        {renderSkeleton()}
      </div>
    </div>
  )

  return user ? <Outlet /> : null
}

export default Protect