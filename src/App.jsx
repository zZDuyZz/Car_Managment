import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard';
import StaffDashboardPage from './pages/StaffDashboardPage';
import ServiceReceptionPage from './pages/ServiceReceptionPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState('');

    const handleLoginSuccess = (role) => {
        setIsLoggedIn(true);
        setUserRole(role);

        if (role === 'admin') {
            setUserName('Admin');
        } else if (role === 'customer') {
            setUserName('Khách hàng');
        } else if (role === 'staff') {
            setUserName('Nhân viên');
        }
    };

    // Nếu chưa đăng nhập, chỉ cho phép truy cập trang login
    if (!isLoggedIn) {
        return (
            <Routes>
                <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    }

    // Nếu là Admin, chỉ hiển thị các route của Admin
    if (userRole === 'admin') {
        return (
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<DashboardPage userName={userName} userRole={userRole} />} />
                <Route path="/reception" element={<ServiceReceptionPage userName={userName} userRole={userRole} />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        );
    }

    // Nếu là Staff, chỉ hiển thị các route của Staff
    if (userRole === 'staff') {
        return (
            <Routes>
                <Route path="/" element={<Navigate to="/staff-dashboard" />} />
                <Route path="/staff-dashboard" element={<StaffDashboardPage userName={userName} userRole={userRole} />} />
                <Route path="/reception" element={<ServiceReceptionPage userName={userName} userRole={userRole} />} />
                <Route path="*" element={<Navigate to="/staff-dashboard" />} />
            </Routes>
        );
    }

    // Nếu là Customer, chỉ hiển thị các route của Customer
    if (userRole === 'customer') {
        return (
            <Routes>
                <Route path="/" element={<Navigate to="/customer-dashboard" />} />
                <Route path="/customer-dashboard" element={<CustomerDashboardPage userName={userName} userRole={userRole} />} />
                <Route path="*" element={<Navigate to="/customer-dashboard" />} />
            </Routes>
        );
    }

    return null;
}

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;