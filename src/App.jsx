import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import ServiceReceptionPage from './pages/ServiceReceptionPage';
import ReceptionForm from './pages/Staff/ReceptionForm';
import RepairForm from './pages/Staff/RepairForm';
import ProtectedLayout from './components/ProtectedLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        JSON.parse(localStorage.getItem('isLoggedIn')) || false
    );
    const [userName, setUserName] = useState(
        localStorage.getItem('userName') || 'Nhân viên'
    );
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('userRole', 'staff');
        localStorage.setItem('userName', 'Nhân viên');
        
        setIsLoggedIn(true);
        setUserName('Nhân viên');
        navigate('/dashboard');
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName('');
        navigate('/');
    };

    return (
        <Routes>
            <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes for Staff */}
            <Route element={
                <ProtectedRoute 
                    isLoggedIn={isLoggedIn} 
                    userRole="staff" 
                    requiredRole="staff" 
                />}
            >
                <Route element={
                    <ProtectedLayout 
                        userName={userName} 
                        userRole="staff" 
                        onLogout={handleLogout} 
                    />}
                >
                    <Route path="/dashboard" element={<StaffDashboardPage />} />
                    <Route path="/reception" element={<ServiceReceptionPage />} />
                    <Route path="/reception-form" element={<ReceptionForm />} />
                    <Route path="/repair-form" element={<RepairForm />} />
                    <Route path="/history" element={<div>Trang Lịch sử sửa chữa</div>} />
                </Route>
            </Route>

            <Route path="*" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
    );
}

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
