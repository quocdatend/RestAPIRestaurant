import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Auth Routes
import { ProtectedRoute, PublicRoute } from './routes/AuthRoutes';

// Import components chung
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Import các trang chính
import Home from './pages/layout/Home';
import About from './pages/About/About';
import Menu from './pages/Menu/Menu';
import Contact from './pages/Contact/Contact';
import Reservation from './pages/Reservation/Reservation';
import BookingHistory from './pages/BookingHistory/BookingHistory';
import CustomerReview from './pages/Review/CustomerReview';

// Import các components Auth
import Login from './components/User/auth/LoginForm';
import Register from './components/User/auth/RegisterForm';
import ForgotPassword from './components/User/auth/ForgotPasswordForm';
import ResetPassword from './components/User/auth/ResetPasswordForm';

// Import Admin pages
import Dashboard from './pages/admin/Dashboard';
import UsersPage from './pages/admin/users';
import MenuPage from './pages/admin/menu';
import OrdersPage from './pages/admin/orders';
import ReviewManagement from './pages/admin/review';

// Import trang lỗi
import NotFound from './pages/layout/NotFound';

function App() {
  
  const isAdminRoute = (pathname) => {
    return pathname.startsWith('/admin');
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Toast notifications - cấu hình chung cho toàn ứng dụng */}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="rounded-lg shadow-lg bg-white text-gray-800"
          progressClassName="bg-yellow-500"
        />
        
        {/* Hiển thị Header không cần đăng nhập */}
        {!isAdminRoute(window.location.pathname) && <Header />}
        
        {/* Main content */}
        <main className="flex-grow">
          <Routes>
            {/* Trang Auth - Sử dụng PublicRoute */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            <Route path="/reset-password/:token" element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } />
            
            {/* Các trang xem được mà không cần đăng nhập */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            
            {/* Các trang khác - Vẫn yêu cầu đăng nhập */}
            <Route path="/contact" element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            } />
            <Route path="/reservation" element={
              <ProtectedRoute>
                <Reservation />
              </ProtectedRoute>
            } />
            <Route path="/BookingHistory" element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            } />
            <Route path="/CustomerReview" element={
              <ProtectedRoute>
                <CustomerReview />
              </ProtectedRoute>
            } />
            
            {/* Routes Admin - Sử dụng ProtectedRoute */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/menu" element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/review" element={
              <ProtectedRoute>
                <ReviewManagement />
              </ProtectedRoute>
            } />
            
            {/* Trang lỗi */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        
        {/* Hiển thị Footer không cần đăng nhập */}
        {!isAdminRoute(window.location.pathname) && <Footer />}
      </div>
    </Router>
  );
}

export default App;