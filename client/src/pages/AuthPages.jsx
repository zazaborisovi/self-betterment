import { GeneralForm } from "./components/generalAuthForm"
import { useAuth } from "../contexts/authContext"

const SignupPage = () =>{
    const {signup} = useAuth()
    return <GeneralForm func={signup} />
}

const SigninPage = () =>{
    const {signin} = useAuth()
    return <GeneralForm func={signin} />
}

export {SignupPage , SigninPage}