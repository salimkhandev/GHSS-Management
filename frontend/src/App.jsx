import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import StudentForm from "./components/registration/StudentForm";
import StudentList from "./components/StudentList";
import ClassSelector from "./components/studnetPromotion/ClassSelector";
import ShowAttenStatus from "./components/attendance/ShowAttenStatus";
import TakenAtten from "./components/attendance/TakeAtten";
import TeacherLogin from "./components/attendance/TeacherLogin"
import AdminLogin from "./components/admin/AdminLogin"
import TeacherRegistration from "./components/admin/TeacherRegistration"
import AdminRegistration from "./components/admin/AdminRegistration"
import ProtectedRoutes from "./components/admin/ProtectedRoutes"
import Home from './components/Home';

import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return <div>
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/promote" element={<ClassSelector />} />
          <Route path="/studentlist" element={<StudentList />} />
          <Route path="/contact" element={<StudentForm />} />
          <Route path="/ShowAttenStatus" element={<ShowAttenStatus />} />

          <Route path="/TakeAtten" element={<TakenAtten />} />

          <Route path="/TeacherLogin" element={<TeacherLogin />} />
          <Route path="/admin" element={<AdminLogin />} setIsAuthenticated={setIsAuthenticated} />
          <Route path="/admin/TeacherRegistration" element={<TeacherRegistration />} /> 
          <Route path="/admin/TeacherRegistration/AdminRegistration" element={
              <AdminRegistration />           
          } /> 
          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<h1>not found</h1>} />
        </Routes>
      </main>
    </Router>
  </div>;
}



export default App; 