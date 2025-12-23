import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api.js';

const LoginPage = ({ onLoginSuccess }) => {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Vui lòng điền đầy đủ thông tin đăng nhập!");
            return;
        }
        
        setIsLoggingIn(true);
        setError('');
        
        try {
            // Call real API
            const response = await apiService.login(username, password);
            
            if (response.success) {
                const { user } = response.data;
                
                // Store user info
                localStorage.setItem('isLoggedIn', JSON.stringify(true));
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Call success callback
                if (onLoginSuccess) {
                    onLoginSuccess(user.role);
                }
                
                // Navigate based on role
                if (user.role === 'admin') {
                    navigate('/admin/accounts');
                } else {
                    navigate('/staff/customers');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                {/* Logo */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">CAR SERVICE</h1>
                    <p className="mt-2 text-gray-600">Đăng nhập vào hệ thống</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

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
                                disabled={isLoggingIn}
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
                                disabled={isLoggingIn}
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

                {/* Demo Credentials */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Tài khoản demo:</p>
                    <p className="text-sm text-blue-600">
                        Username: <code className="bg-blue-100 px-1 rounded">admin</code><br/>
                        Password: <code className="bg-blue-100 px-1 rounded">admin123</code>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;