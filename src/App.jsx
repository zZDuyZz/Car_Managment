import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import LoginPage from './pages/Auth/LoginPage';
import SignUpPage from './pages/Auth/SignUpPage';
import StaffLayout from './layouts/StaffLayout';
import AdminLayout from './layouts/AdminLayout';

// Staff pages
import Customers from './pages/Staff/Customers';
import Vehicles from './pages/Staff/Vehicles';
import Repairs from './pages/Staff/Repairs';
import Invoices from './pages/Staff/Invoices';
import Search from './pages/Staff/Search';

// Admin pages
import Accounts from './pages/Admin/Accounts';
import Reports from './pages/Admin/Reports';
import ImportGoods from './pages/Admin/ImportGoods';
import AdminSettings from './pages/Admin/AdminSettings';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const handleLogin = (role) => {
    const userData = { role, isLoggedIn: true };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            user?.isLoggedIn ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/staff'} replace />
            ) : (
              <LoginPage onLoginSuccess={handleLogin} />
            )
          } 
        />
        
        <Route path="/signup" element={<SignUpPage />} />

        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            user?.isLoggedIn && user?.role === 'admin' ? (
              <AdminLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="/admin/accounts" replace />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="reports" element={<Reports />} />
          <Route path="import" element={<ImportGoods />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Staff routes */}
        <Route 
          path="/staff" 
          element={
            user?.isLoggedIn && user?.role === 'staff' ? (
              <StaffLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="/staff/vehicles" replace />} />
          <Route path="customers" element={<Customers />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="repairs" element={<Repairs />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="search" element={<Search />} />
          
          {/* New item routes */}
          <Route path="customers/new" element={<div className="p-6">Thêm khách hàng mới</div>} />
          <Route path="vehicles/new" element={<div className="p-6">Thêm xe mới</div>} />
          <Route path="repairs/new" element={<div className="p-6">Tạo phiếu sửa chữa mới</div>} />
          <Route path="invoices/new" element={<div className="p-6">Tạo hóa đơn mới</div>} />
        </Route>

        {/* Root redirect */}
        <Route 
          path="/" 
          element={
            user?.isLoggedIn ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/staff'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;