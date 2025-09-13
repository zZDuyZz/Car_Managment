import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, userRole, requiredRole }) => {
    // Nếu chưa đăng nhập, chuyển hướng về trang login
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // Nếu vai trò không đúng, chuyển hướng về trang dashboard tương ứng
    if (requiredRole && userRole !== requiredRole) {
        if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (userRole === 'staff') return <Navigate to="/staff/dashboard" replace />;
        if (userRole === 'customer') return <Navigate to="/customer/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    // Nếu đã đăng nhập và có quyền, hiển thị nội dung
    return <Outlet />;
};

export default ProtectedRoute;