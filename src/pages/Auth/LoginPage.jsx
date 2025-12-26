import React, { useState } from "react";

const LoginPage = ({ onLoginSuccess }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert("Vui lòng điền đầy đủ thông tin đăng nhập!");
            return;
        }
        
        setIsLoggingIn(true);
        
        // Mock login logic - Updated to match database
        const mockAdminUsername = "admin";
        const mockAdminPassword = "admin123";
        const mockStaffUsername = "staff";
        const mockStaffPassword = "staff123";

        setTimeout(() => {
            setIsLoggingIn(false);
            if (username === mockAdminUsername && password === mockAdminPassword) {
                onLoginSuccess('admin');
            } else if (username === mockStaffUsername && password === mockStaffPassword) {
                onLoginSuccess('staff');
            } else {
                alert("Tên đăng nhập hoặc mật khẩu không chính xác!");
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
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên đăng nhập
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Nhập tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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