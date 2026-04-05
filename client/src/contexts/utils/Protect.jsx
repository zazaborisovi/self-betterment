import { useEffect } from "react"
import {useAuth} from "../authContext"
import {useNavigate , Outlet} from "react-router"

const Protect = ({ children }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if(!loading && !user)
      navigate("signup")
  }, [loading, user, navigate])
  
  if(loading) return <div>loading...</div>
  
  return user ? <Outlet /> : null
}

export default Protect