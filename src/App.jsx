import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import DashboardPage from './pages/Dashboard';
import StaffDashboardPage from './pages/StaffDashboardPage';
import ServiceReceptionPage from './pages/ServiceReceptionPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import ReceptionForm from './pages/Staff/ReceptionForm';
import RepairForm from './pages/Staff/RepairForm'; // Thêm dòng này để import component RepairForm
import ProtectedLayout from './components/ProtectedLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        JSON.parse(localStorage.getItem('isLoggedIn')) || false
    );
    const [userRole, setUserRole] = useState(
        localStorage.getItem('userRole') || null
    );
    const [userName, setUserName] = useState(
        localStorage.getItem('userName') || ''
    );
    const navigate = useNavigate();

    const handleLoginSuccess = (role) => {
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('userRole', role);

        setIsLoggedIn(true);
        setUserRole(role);

        if (role === 'admin') {
            setUserName('Admin');
            localStorage.setItem('userName', 'Admin');
            navigate('/admin/dashboard');
        } else if (role === 'customer') {
            setUserName('Khách hàng');
            localStorage.setItem('userName', 'Khách hàng');
            navigate('/customer/dashboard');
        } else if (role === 'staff') {
            setUserName('Nhân viên');
            localStorage.setItem('userName', 'Nhân viên');
            navigate('/staff/dashboard');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName('');
        navigate('/');
    };

    return (
        <Routes>
            <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Các route bảo vệ cho Admin */}
            <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="admin" />}>
                <Route element={<ProtectedLayout userName={userName} userRole={userRole} onLogout={handleLogout} />}>
                    <Route path="/admin/dashboard" element={<DashboardPage />} />
                    <Route path="/admin/reception" element={<ServiceReceptionPage />} />
                    <Route path="/admin/history" element={<div>Trang Lịch sử sửa chữa của Admin</div>} />
                </Route>
            </Route>

            {/* Các route bảo vệ cho Staff */}
            <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="staff" />}>
                <Route element={<ProtectedLayout userName={userName} userRole={userRole} onLogout={handleLogout} />}>
                    <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
                    <Route path="/staff/reception" element={<ServiceReceptionPage />} />
                    <Route path="/staff/reception-form" element={<ReceptionForm />} />
                    <Route path="/staff/repair-form" element={<RepairForm />} /> {/* Thêm route mới cho phiếu sửa chữa */}
                    <Route path="/staff/history" element={<div>Trang Lịch sử sửa chữa của Staff</div>} />
                </Route>
            </Route>

            {/* Các route bảo vệ cho Customer */}
            <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} userRole={userRole} requiredRole="customer" />}>
                <Route element={<ProtectedLayout userName={userName} userRole={userRole} onLogout={handleLogout} />}>
                    <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
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
