import { Navigate, useLocation } from 'react-router-dom';
import Auth from '../pages/Auth/Auth';

// HOC để bảo vệ các route yêu cầu authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  if (!token) {
    // Lưu lại đường dẫn hiện tại để sau khi đăng nhập có thể redirect về
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// HOC để chuyển hướng user đã đăng nhập
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AuthRoutes = [
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
  },
  {
    path: '/reset-password/:token',
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
  }
];

export { ProtectedRoute, PublicRoute, AuthRoutes };