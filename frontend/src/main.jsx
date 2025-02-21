import { createRoot } from 'react-dom/client'
// import App from './components/attendance/Login'
// import App from './components/attendance/TakeAtten'
// import App from './AttendanceList.jsx'
// import App from './components/admin/AdminLogin'
// import App from './components/admin/TeacherRegistration'
import { AuthProvider } from './components/admin/AuthProvider'
import App from './App'

// import App from './components/attendance/DailyAttenAfterSuccess'
// import App from './components/teacher/ProfilePicManager'
// import App from './components/registration/StudentForm'
// import App from './components/attendance/pieChart/attenBasedSectionsPerformance'
// import App from './components/attendance/pieChart/Container'
// import App from './components/attendance/pieChart/PerformanceDashboard'
import './index.css'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
      <App />
  </AuthProvider>
)

// how to call a function

