import { useAuth } from "../contexts/authContext";
import GeneralAuthForm from "./components/generalAuthForm";

export const Signup = () =>{
    const {signup} = useAuth()

    return <GeneralAuthForm func={signup} />
}
export const Signin = () =>{
    const {signin} = useAuth()

    return <GeneralAuthForm func={signin} />
}