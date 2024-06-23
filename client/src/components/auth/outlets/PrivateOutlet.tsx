import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { LoadingPage } from '../../LoadingPage/LoadingPage';

function NavigateToLogin() {
  const location = useLocation();
  return <Navigate to="/login" state={{ locationFrom: location.pathname }} />;
}

export function PrivateOutlet() {
  const { user, loading } = useUser();

  if (loading) {
    return <LoadingPage />;
  }

  return user ? <Outlet /> : <NavigateToLogin />;
}
