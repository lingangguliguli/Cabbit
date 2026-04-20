// React concepts: conditional rendering, routing guards, Context API

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage message="Checking authentication..." />;
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
