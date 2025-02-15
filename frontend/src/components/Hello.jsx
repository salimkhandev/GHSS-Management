import { useState } from "react";

export default function LoginComponent() {
    const [showOptions, setShowOptions] = useState(false);
    const [userType, setUserType] = useState(""); // "admin" or "teacher"

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* Login Button */}
            {!showOptions ? (
                <button
                    onClick={() => setShowOptions(true)}
                    className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                    Login
                </button>
            ) : (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Login As</h2>

                    {/* User Type Selection */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setUserType("admin")}
                            className={`px-4 py-2 text-white rounded-lg transition-all ${userType === "admin" ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                                }`}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => setUserType("teacher")}
                            className={`px-4 py-2 text-white rounded-lg transition-all ${userType === "teacher" ? "bg-green-700" : "bg-green-500 hover:bg-green-600"
                                }`}
                        >
                            Teacher
                        </button>
                    </div>

                    {/* Login Form */}
                    {userType && (
                        <form className="mt-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                            />
                            <button
                                type="submit"
                                className="w-full mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
