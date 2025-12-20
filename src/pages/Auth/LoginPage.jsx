import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Vui lòng điền đầy đủ thông tin đăng nhập!");
            return;
        }
        
        setIsLoggingIn(true);
        
        // Mock login logic
        const mockAdminEmail = "admin@example.com";
        const mockAdminPassword = "123456";
        const mockStaffEmail = "staff@example.com";
        const mockStaffPassword = "staff123";

        setTimeout(() => {
            setIsLoggingIn(false);
            if (email === mockAdminEmail && password === mockAdminPassword) {
                if (onLoginSuccess) {
                    onLoginSuccess('admin');
                    navigate('/admin/accounts');
                }
            } else if (email === mockStaffEmail && password === mockStaffPassword) {
                if (onLoginSuccess) {
                    onLoginSuccess('staff');
                    navigate('/customers');
                }
            } else {
                alert("Email hoặc mật khẩu không chính xác!");
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                {/* Logo */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">CAR SERVICE</h1>
                    <p className="mt-2 text-gray-600">Đăng nhập vào hệ thống</p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;