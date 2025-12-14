import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignUpPage from './pages/Auth/SignUpPage';
import Customers from './pages/Staff/Customers';
import Vehicles from './pages/Staff/Vehicles';
import Repairs from './pages/Staff/Repairs';
import RepairServices from './pages/Staff/RepairServices';
import StaffLayout from './layouts/StaffLayout';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        JSON.parse(localStorage.getItem('isLoggedIn')) || false
    );
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        setIsLoggedIn(true);
        navigate('/customers');
    };

    const handleSignUpSuccess = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/login');
    };

    if (!isLoggedIn) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/signup" element={<SignUpPage onSignUpSuccess={handleSignUpSuccess} />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/customers" replace />} />
            <Route element={<StaffLayout onLogout={handleLogout} />}>
                <Route path="customers" element={<Customers />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="repairs" element={<Repairs />} />
                <Route path="repair-services" element={<RepairServices />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
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