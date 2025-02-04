import { lazy, Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from './components/Home';
import AdminLogin from "./components/admin/AdminLogin";
import { AuthProvider } from "./components/admin/AuthProvider";
import Protecter from "./components/admin/ProtectedLoginRoute";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

// Lazy-load components
const StudentForm = lazy(() => import("./components/registration/StudentForm"));
const StudentList = lazy(() => import("./components/StudentList"));
const TeacherRegistration = lazy(() => import("./components/admin/TeacherRegistration"));
const TeacherLogin = lazy(() => import("./components/attendance/TeacherLogin"));
const AdminRegistration = lazy(() => import("./components/admin/AdminRegistration"));
const PerformanceDashboard = lazy(() => import("./components/attendance/pieChart/PerformanceDashboard"));
const TakenAtten = lazy(() => import("./components/attendance/TakeAtten"));
const ClassSelector = lazy(() => import("./components/studnetPromotion/ClassSelector"));

// MUI Linear Progress Loader
const Loader = () => (
  <Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>
);


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/studentlist"
              element={
                <Suspense fallback={<Loader />}>
                  <StudentList />
                </Suspense>
              }
            />
            <Route
              path="/PerformanceDashboard"
              element={
                <Suspense fallback={<Loader />}>
                  <PerformanceDashboard />
                </Suspense>
              }
            />
            <Route
              path="/TakeAtten"
              element={
                <Suspense fallback={<Loader />}>
                  <TakenAtten />
                </Suspense>
              }
            />
            <Route path="/TeacherLogin" element={<TeacherLogin />} />
            <Route path="/admin" element={<AdminLogin />} />

            {/* Catch-all route */}
            <Route path="*" element={<h1>Not Found</h1>} />

            {/* Protected Routes */}
            <Route element={<Protecter />}>
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<Loader />}>
                    <StudentForm />
                  </Suspense>
                }
              />
              <Route
                path="/promote"
                element={
                  <Suspense fallback={<Loader />}>
                    <ClassSelector />
                  </Suspense>
                }
              />
              <Route
                path="/admin/TeacherRegistration/AdminRegistration"
                element={
                  <Suspense fallback={<Loader />}>
                    <AdminRegistration />
                  </Suspense>
                }
              />
              <Route
                path="/admin/TeacherRegistration"
                element={
                  <Suspense fallback={<Loader />}>
                    <TeacherRegistration />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
