import { GeneralForm } from "./components/generalAuthForm";
import { useAuth } from "../context/authContext"

const Signup = () =>{
    const { signup } = useAuth()

    return(
        <GeneralForm func={signup} />
    )
}

const Signin = () =>{
    const { signin } = useAuth()

    return(
        <GeneralForm func={signin} />
    )
}

export {Signup , Signin}