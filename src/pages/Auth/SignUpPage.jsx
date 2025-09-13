// src/pages/Auth/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        setIsSigningUp(true);

        // --- Logic đăng ký giả lập (sẽ thay thế sau) ---
        setTimeout(() => {
            setIsSigningUp(false);
            alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
            // Chuyển hướng người dùng về trang đăng nhập
            navigate('/');
        }, 2000);
    };

    return (
        <AuthLayout isLogin={false}>
            <form className="w-full max-w-md space-y-6" onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Họ và tên"
                    className="w-full px-5 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-5 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full px-5 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
                    disabled={isSigningUp}
                >
                    {isSigningUp ? "Đang đăng ký..." : "Đăng ký"}
                </button>
            </form>
        </AuthLayout>
    );
};

export default SignupPage;