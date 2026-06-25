import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUser } from '../utils/authService';

export default function RequireAuth({ children, allowedRoles = [] }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
