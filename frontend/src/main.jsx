import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './components/attendance/Login'
// import App from './components/attendance/TakeAtten'
// import App from './AttendanceList.jsx'
// import App from './components/admin/AdminLogin'
// import App from './components/admin/TeacherRegistration'
import {AuthProvider} from './components/admin/AuthProvider'
// import App from './App'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  {/* <StrictMode> */}

      <App />
  {/* </StrictMode>, */}
  </AuthProvider>
)
