import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignUpPage from './pages/Auth/SignUpPage';
import Customers from './pages/Staff/Customers';
import Vehicles from './pages/Staff/Vehicles';
import Repairs from './pages/Staff/Repairs';
import RepairServices from './pages/Staff/RepairServices';
import SpareParts from './pages/Staff/SpareParts';
import Invoices from './pages/Staff/Invoices';
import Search from './pages/Staff/Search';
import Accounts from './pages/Admin/Accounts';
import Employees from './pages/Admin/Employees';
import AdminCustomers from './pages/Admin/Customers';
import Services from './pages/Admin/Services';
import Parts from './pages/Admin/Parts';
import Statistics from './pages/Admin/Statistics';
import StaffLayout from './layouts/StaffLayout';
import AdminLayout from './layouts/AdminLayout';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        JSON.parse(localStorage.getItem('isLoggedIn')) || false
    );
    const [userRole, setUserRole] = useState(
        localStorage.getItem('userRole') || null
    );
    const navigate = useNavigate();

    const handleLoginSuccess = (role) => {
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('userRole', role);
        setIsLoggedIn(true);
        setUserRole(role);
        
        if (role === 'admin') {
            navigate('/admin/accounts');
        } else {
            navigate('/customers');
        }
    };

    const handleSignUpSuccess = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <Routes>
            <Route path="/login" element={
                isLoggedIn ? <Navigate to={userRole === 'admin' ? '/admin/accounts' : '/customers'} replace /> : 
                <LoginPage onLoginSuccess={handleLoginSuccess} />
            } />
            <Route path="/signup" element={<SignUpPage onSignUpSuccess={handleSignUpSuccess} />} />
            
            <Route element={<AdminLayout onLogout={handleLogout} />}>
                <Route path="admin/accounts" element={
                    isLoggedIn && userRole === 'admin' ? <Accounts /> : <Navigate to="/login" replace />
                } />
                <Route path="admin/employees" element={
                    isLoggedIn && userRole === 'admin' ? <Employees /> : <Navigate to="/login" replace />
                } />
                <Route path="admin/customers" element={
                    isLoggedIn && userRole === 'admin' ? <AdminCustomers /> : <Navigate to="/login" replace />
                } />
                <Route path="admin/services" element={
                    isLoggedIn && userRole === 'admin' ? <Services /> : <Navigate to="/login" replace />
                } />
                <Route path="admin/parts" element={
                    isLoggedIn && userRole === 'admin' ? <Parts /> : <Navigate to="/login" replace />
                } />
                <Route path="admin/statistics" element={
                    isLoggedIn && userRole === 'admin' ? <Statistics /> : <Navigate to="/login" replace />
                } />
            </Route>
            
            <Route path="/staff" element={
                isLoggedIn && userRole === 'staff' ? <StaffLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />
            }>
                <Route index element={<Navigate to="/staff/customers" replace />} />
                <Route path="dashboard" element={<div>Dashboard Content</div>} />
                <Route path="customers" element={<Customers />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="repairs" element={<Repairs />} />
                <Route path="services" element={<RepairServices />} />
                <Route path="parts" element={<SpareParts />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="search" element={<Search />} />
                
                {/* New item routes */}
                <Route path="customers/new" element={<div>New Customer Form</div>} />
                <Route path="vehicles/new" element={<div>New Vehicle Form</div>} />
                <Route path="repairs/new" element={<div>New Repair Form</div>} />
                <Route path="invoices/new" element={<div>New Invoice Form</div>} />
            </Route>
            
            {/* Redirect old routes to new /staff paths */}
            <Route path="/customers" element={
                isLoggedIn && userRole === 'staff' ? <Navigate to="/staff/customers" replace /> : <Navigate to="/login" replace />
            } />
            <Route path="/vehicles" element={
                isLoggedIn && userRole === 'staff' ? <Navigate to="/staff/vehicles" replace /> : <Navigate to="/login" replace />
            } />
            <Route path="/repairs" element={
                isLoggedIn && userRole === 'staff' ? <Navigate to="/staff/repairs" replace /> : <Navigate to="/login" replace />
            } />
            <Route path="/repair-services" element={
                isLoggedIn && userRole === 'staff' ? <Navigate to="/staff/services" replace /> : <Navigate to="/login" replace />
            } />
            <Route path="/spare-parts" element={
                isLoggedIn && userRole === 'staff' ? <Navigate to="/staff/parts" replace /> : <Navigate to="/login" replace />
            } />
            <Route path="/invoices" element={
                isLoggedIn && userRole === 'staff' ? <Navigate to="/staff/invoices" replace /> : <Navigate to="/login" replace />
            } />
            <Route path="/search" element={
                isLoggedIn && userRole === 'staff' ? <Navigate to="/staff/search" replace /> : <Navigate to="/login" replace />
            } />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
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