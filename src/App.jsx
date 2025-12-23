import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignUpPage from './pages/Auth/SignUpPage';
import StaffLayout from './layouts/StaffLayout';
import AdminLayout from './layouts/AdminLayout';

// Staff components
import Customers from './pages/Staff/Customers';
import Vehicles from './pages/Staff/Vehicles';
import Repairs from './pages/Staff/Repairs';
import RepairServices from './pages/Staff/RepairServices';
import SpareParts from './pages/Staff/SpareParts';
import Invoices from './pages/Staff/Invoices';
import Search from './pages/Staff/Search';

// Admin components
import Accounts from './pages/Admin/Accounts';
import Reports from './pages/Admin/Reports';
import ImportGoods from './pages/Admin/ImportGoods';
import AdminSettings from './pages/Admin/AdminSettings';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // Initialize state from localStorage
    useEffect(() => {
        const loggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
        const role = localStorage.getItem('userRole') || null;
        setIsLoggedIn(loggedIn);
        setUserRole(role);
    }, []);

    const handleLoginSuccess = (role) => {
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('userRole', role);
        setIsLoggedIn(true);
        setUserRole(role);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserRole(null);
    };

    // Show loading while checking auth state
    if (isLoggedIn === null) {
        return <div>Loading...</div>;
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route 
                path="/login" 
                element={
                    isLoggedIn ? (
                        <Navigate to={userRole?.toLowerCase() === 'admin' ? '/admin/accounts' : '/staff/customers'} replace />
                    ) : (
                        <LoginPage onLoginSuccess={handleLoginSuccess} />
                    )
                } 
            />
            <Route path="/signup" element={<SignUpPage />} />
            
            {/* Admin Routes */}
            <Route 
                path="/admin/*" 
                element={
                    isLoggedIn && userRole?.toLowerCase() === 'admin' ? (
                        <AdminLayout onLogout={handleLogout} />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            >
                <Route index element={<Navigate to="accounts" replace />} />
                <Route path="accounts" element={<Accounts />} />
                <Route path="reports" element={<Reports />} />
                <Route path="import" element={<ImportGoods />} />
                <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            {/* Staff Routes */}
            <Route 
                path="/staff/*" 
                element={
                    isLoggedIn && userRole?.toLowerCase() === 'staff' ? (
                        <StaffLayout onLogout={handleLogout} />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            >
                <Route index element={<Navigate to="customers" replace />} />
                <Route path="customers" element={<Customers />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="repairs" element={<Repairs />} />
                <Route path="services" element={<RepairServices />} />
                <Route path="parts" element={<SpareParts />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="search" element={<Search />} />
            </Route>
            
            {/* Default redirect */}
            <Route 
                path="/" 
                element={
                    isLoggedIn ? (
                        <Navigate to={userRole?.toLowerCase() === 'admin' ? '/admin/accounts' : '/staff/customers'} replace />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                } 
            />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;