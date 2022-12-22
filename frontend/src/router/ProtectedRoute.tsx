import {
  Navigate,
  Outlet,
  Route,
  RouteProps,
  Routes,
  useLocation,
} from 'react-router-dom';

import useAuth from '@/hooks/useAuth';

export const ProtectedRoute = () => {
  const { user, initialLoading } = useAuth();
  return !initialLoading && user ? <Outlet /> : <Navigate to="/login" />;
};
