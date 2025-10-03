import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import ServiceReceptionPage from './pages/ServiceReceptionPage';
import ReceptionForm from './pages/Staff/ReceptionForm';
import RepairForm from './pages/Staff/RepairForm';
import ProtectedLayout from './components/ProtectedLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RepairOrdersPage from './pages/RepairOrdersPage';
import VehicleSearchPage from './pages/VehicleSearchPage';
import PaymentFormsPage from './pages/PaymentFormsPage';
import RevenuePage from './pages/Reports/RevenuePage';
import InventoryPage from './pages/Reports/InventoryPage';
import RegulationsPage from './pages/RegulationsPage';

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
                        onLogout={handleLogout} 
                    />}
                >
                    <Route path="/dashboard" element={<StaffDashboardPage />} />
                    <Route path="/reception" element={<ServiceReceptionPage />} />
                    <Route path="/repair-orders" element={<RepairOrdersPage />} />
                    <Route path="/vehicle-search" element={<VehicleSearchPage />} />
                    <Route path="/payment-forms" element={<PaymentFormsPage />} />
                    <Route path="/reports/revenue" element={<RevenuePage />} />
                    <Route path="/reports/inventory" element={<InventoryPage />} />
                    <Route path="/regulations" element={<RegulationsPage />} />
                    <Route path="/reception-form" element={<ReceptionForm />} />
                    <Route path="/repair-form" element={<RepairForm />} />
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
