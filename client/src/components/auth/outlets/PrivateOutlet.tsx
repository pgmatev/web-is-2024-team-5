import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';

function NavigateToLogin() {
  const location = useLocation();
  return <Navigate to="/login" state={{ locationFrom: location.pathname }} />;
}

export function PrivateOutlet() {
  const { user } = useUser();
  return user ? <Outlet /> : <NavigateToLogin />;
}
