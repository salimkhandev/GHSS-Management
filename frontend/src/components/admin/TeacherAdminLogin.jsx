import { useState } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";

const LoginForm = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [admin, setAdmin] = useState({ username: "", password: "" });
    const [teacher, setTeacher] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        try {
            const [adminRes, teacherRes] = await Promise.all([
                fetch("https://ghss-management-backend.vercel.app/admin-login", {

                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(admin),
                }),
                fetch("https://ghss-management-backend.vercel.app/teacherLogin", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(teacher),
                }),
            ]);

            const adminData = await adminRes.json();
            const teacherData = await teacherRes.json();

            if (adminRes.ok) {
                enqueueSnackbar("✅ Admin Login Successful!", { variant: "success" });
            } else {
                enqueueSnackbar(`❌ Admin Login Failed: ${adminData.message}`, { variant: "error" });
            }

            if (teacherRes.ok) {
                enqueueSnackbar("✅ Teacher Login Successful!", { variant: "success" });
            } else {
                enqueueSnackbar(`❌ Teacher Login Failed: ${teacherData.message}`, { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar("❌ Something went wrong. Please try again.", { variant: "error" });
            console.error("Login failed:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center text-gray-700">Admin & Teacher Login</h2>

                <form onSubmit={handleLogin} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Admin Login */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-600">Admin Login</h3>
                        <input
                            type="text"
                            placeholder="Admin Username"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={admin.username}
                            onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Admin Password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={admin.password}
                            onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                        />
                    </div>

                    {/* Teacher Login */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-600">Teacher Login</h3>
                        <input
                            type="text"
                            placeholder="Teacher Username"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={teacher.username}
                            onChange={(e) => setTeacher({ ...teacher, username: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Teacher Password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={teacher.password}
                            onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-1 md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Login Both"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Wrapping the component inside SnackbarProvider
const App = () => (
    <SnackbarProvider maxSnack={3}>
        <LoginForm />
    </SnackbarProvider>
);

export default App;
