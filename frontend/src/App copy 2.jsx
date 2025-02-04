import { lazy, Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from './components/Home';
import AdminLogin from "./components/admin/AdminLogin";
import { AuthProvider } from "./components/admin/AuthProvider";
import Protecter from "./components/admin/ProtectedLoginRoute";

// Lazy-load components
const StudentForm = lazy(() => import("./components/registration/StudentForm"));
const StudentList = lazy(() => import("./components/StudentList"));
const TeacherRegistration = lazy(() => import("./components/admin/TeacherRegistration"));
const TeacherLogin = lazy(() => import("./components/attendance/TeacherLogin"));
const AdminRegistration = lazy(() => import("./components/admin/AdminRegistration"));
const PerformanceDashboard = lazy(() => import("./components/attendance/pieChart/PerformanceDashboard"));
const TakenAtten = lazy(() => import("./components/attendance/TakeAtten"));
const ClassSelector = lazy(() => import("./components/studnetPromotion/ClassSelector"));

// Prefetch function
const prefetchComponent = (importFunction) => () => importFunction();

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
                <Suspense fallback={<div>Loading Student List...</div>}>
                  <StudentList />
                </Suspense>
              }
            />
            <Route
              path="/PerformanceDashboard"
              element={
                <Suspense fallback={<div>Preparing Dashboard...</div>}>
                  <PerformanceDashboard />
                </Suspense>
              }
            />
            <Route
              path="/TakeAtten"
              element={
                <Suspense fallback={<div>Loading Attendance Page...</div>}>
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
                  <Suspense fallback={<div>Loading Registration Form...</div>}>
                    <StudentForm />
                  </Suspense>
                }
              />
              <Route
                path="/promote"
                element={
                  <Suspense fallback={<div>Loading Class Promotion...</div>}>
                    <ClassSelector />
                  </Suspense>
                }
              />
              <Route
                path="/admin/TeacherRegistration/AdminRegistration"
                element={
                  <Suspense fallback={<div>Loading Admin Registration...</div>}>
                    <AdminRegistration />
                  </Suspense>
                }
              />
              <Route
                path="/admin/TeacherRegistration"
                element={
                  <Suspense fallback={<div>Loading Teacher Registration...</div>}>
                    <TeacherRegistration />
                  </Suspense>
                }
              />
            </Route>
          </Routes>

          {/* Prefetch Links */}
          <nav>
            <Link to="/studentlist" onMouseEnter={prefetchComponent(() => import("./components/StudentList"))}>
              Go to Student List
            </Link>
            <Link to="/PerformanceDashboard" onMouseEnter={prefetchComponent(() => import("./components/attendance/pieChart/PerformanceDashboard"))}>
              Performance Dashboard
            </Link>
            <Link to="/admin/TeacherRegistration" onMouseEnter={prefetchComponent(() => import("./components/admin/TeacherRegistration"))}>
              Teacher Registration
            </Link>
          </nav>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
