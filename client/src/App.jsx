import { ToastContainer } from 'react-toastify'
import { Routes , Route, useNavigate } from 'react-router'
import { SignupPage , SigninPage } from './pages/AuthPages'
import AuthProvider, { useAuth } from './contexts/authContext'
import Protect from './contexts/utils/Protect'
import Main from './pages/Main'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import TaskProvider from './contexts/taskContext'
import Choices from './pages/Choices'
import UserProvider from './contexts/userContext'
// import { Settings } from './pages/Settings'
import SocketProvider from "./contexts/socketContext"
import Nav from './pages/components/Nav'
import LeaderboardProvider from './contexts/leaderboardContext'
import AdminProvider from './contexts/adminContext'
import AdminPanel from './pages/AdminPanel'
import UserPage from './pages/UserPage'
import FriendProvider from './contexts/friendContext'
import Friends from './pages/Friends'
import ChatProvider from './contexts/chatContext'
import Chat from './pages/Chat'
import { useEffect } from 'react'

function App() {
  return (
    <>
      <AuthProvider>
        <SocketProvider>
          <ChatProvider>
            <div className="h-dvh w-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Nav />
            <main className="flex-1 overflow-hidden relative">
              <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/signin" element={<SigninPage />} />
                
                <Route element={<Protect />}>
                  <Route path="/" element={
                      <TaskProvider>
                          <Main />
                      </TaskProvider>
                    } />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/leaderboard" element={
                    <LeaderboardProvider>
                      <Leaderboard />
                    </LeaderboardProvider>
                  } />
                  <Route path="/choices" element={
                    <UserProvider>
                      <Choices />
                    </UserProvider>
                  } />
                  <Route path="/admin" element={
                    <AdminProvider>
                      <AdminRoute />
                    </AdminProvider>
                  } />
                </Route>
                <Route path="/user/:id" element={
                  <FriendProvider>
                    <UserProvider>
                        <UserPage />
                    </UserProvider>
                  </FriendProvider>
                } />
                <Route path="/friends" element={
                  <FriendProvider>
                    <UserProvider>
                      <Friends />
                    </UserProvider>
                  </FriendProvider>
                } />
                <Route path='/chat' element={
                  <UserProvider>
                    <Chat />
                  </UserProvider>
                } />
                <Route path="/chat/:chatId?" element={
                  <UserProvider>
                    <Chat />
                  </UserProvider>
                } />
              </Routes>
            </main>
          </div>
          </ChatProvider>
        </SocketProvider>
      </AuthProvider>
      <ToastContainer />
    </>
  )
}

const AdminRoute = () =>{
  const {user} = useAuth()
  const navigate = useNavigate()
  useEffect(() =>{
    if(user?.role !== "admin") navigate("/")
  },[user])
  return <AdminPanel />
}

export default App
