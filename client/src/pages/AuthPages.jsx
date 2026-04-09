import { GeneralForm } from "./components/generalAuthForm"
import { useAuth } from "../contexts/authContext"
import { TaskSkeletonList } from "./components/Skeletons"

const SignupPage = () => {
    const { signup, loading } = useAuth()

    if (loading) return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 py-12 px-4 transition-colors duration-300 font-sans">
            <div className="max-w-5xl mx-auto flex flex-col items-center">
                <div className="w-full mb-12 text-center space-y-4 animate-pulse">
                    <div className="h-12 w-64 bg-slate-200 dark:bg-slate-700 rounded-2xl mx-auto mb-4"></div>
                    <div className="h-6 w-96 bg-slate-100 dark:bg-slate-800 rounded-xl mx-auto"></div>
                </div>
                <TaskSkeletonList count={3} />
            </div>
        </div>
    )

    return <GeneralForm func={signup} />
}

const SigninPage = () => {
    const { signin, loading } = useAuth()

    if (loading) return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 py-12 px-4 transition-colors duration-300 font-sans">
            <div className="max-w-5xl mx-auto flex flex-col items-center">
                <div className="w-full mb-12 text-center space-y-4 animate-pulse">
                    <div className="h-12 w-64 bg-slate-200 dark:bg-slate-700 rounded-2xl mx-auto mb-4"></div>
                    <div className="h-6 w-96 bg-slate-100 dark:bg-slate-800 rounded-xl mx-auto"></div>
                </div>
                <TaskSkeletonList count={3} />
            </div>
        </div>
    )

    return <GeneralForm func={signin} />
}

export { SignupPage, SigninPage }