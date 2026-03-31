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

function App() {
  return (
    <>
      <AuthProvider>
        {/* <Nav /> */}
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
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/choices" element={
              <UserProvider>
                <Choices />
              </UserProvider>
            } />
            {/* <Route path="/settings" element={<Settings />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </>
  )
}

export default App
