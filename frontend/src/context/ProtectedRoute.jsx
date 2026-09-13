import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any page that requires login. Optionally restrict to a specific role.
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
