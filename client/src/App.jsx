import { ToastContainer } from 'react-toastify'
import { Routes , Route } from 'react-router'
import { SignupPage , SigninPage } from './pages/AuthPages'
import AuthProvider from './contexts/authContext'
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

function App() {
  return (
    <>
      <AuthProvider>
        <SocketProvider>
          <Nav />
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
                  <AdminPanel />
                </AdminProvider>
              } />
              {/* <Route path="/settings" element={<Settings />} /> */}
            </Route>
            <Route path="/user/:id" element={
              <UserProvider>
                <FriendProvider>
                  <UserPage />
                </FriendProvider>
              </UserProvider>
            } />
          </Routes>
        </SocketProvider>
      </AuthProvider>
      <ToastContainer />
    </>
  )
}

export default App
