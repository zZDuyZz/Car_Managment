// src/pages/Auth/LoginPage.jsx
import React, { useState } from "react";
import AuthLayout from "./AuthLayout"; // Import AuthLayout
import { Link } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // --- Logic đăng nhập giả lập ---
    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        // ... (phần logic giả lập ở đây) ...
        const mockAdminEmail = "admin@example.com";
        const mockAdminPassword = "123456";
        const mockStaffEmail = "staff@example.com";
        const mockStaffPassword = "staff123";

        setTimeout(() => {
            setIsLoggingIn(false);
            if (email === mockAdminEmail && password === mockAdminPassword) {
                alert("Đăng nhập với tài khoản Admin thành công!");
                if (onLoginSuccess) {
                    onLoginSuccess('admin');
                }
            } else if (email === mockStaffEmail && password === mockStaffPassword) {
                alert("Đăng nhập với tài khoản Staff thành công!");
                if (onLoginSuccess) {
                    onLoginSuccess('staff');
                }
            } else {
                alert("Email hoặc mật khẩu không chính xác!");
            }
        }, 2000);
    };

    return (
        <AuthLayout isLogin={true}>
            <form className="w-full max-w-md space-y-6" onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="example@email.com"
                    className="w-full px-5 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-5 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex justify-between text-base text-gray-500">
                    <a href="#" className="hover:underline">
                        Forgot Password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? "Đang đăng nhập..." : "Log In"}
                </button>
            </form>

            <div className="flex items-center my-8 w-full max-w-md">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-4 text-gray-500 text-lg">or</span>
                <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <div className="flex gap-6 flex-wrap justify-center w-full max-w-md">
                <button className="flex items-center gap-3 px-6 py-3 border rounded-lg text-lg hover:bg-gray-100">
                    <img
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        alt="Google"
                        className="w-6 h-6"
                    />
                    Google
                </button>
                <button className="flex items-center gap-3 px-6 py-3 border rounded-lg text-lg hover:bg-gray-100">
                    <img
                        src="https://1.bp.blogspot.com/-S8HTBQqmfcs/XN0ACIRD9PI/AAAAAAAAAlo/FLhccuLdMfIFLhocRjWqsr9cVGdTN_8sgCPcBGAYYCw/s1600/f_logo_RGB-Blue_1024.png"
                        alt="Facebook"
                        className="w-6 h-6"
                    />
                    Facebook
                </button>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;