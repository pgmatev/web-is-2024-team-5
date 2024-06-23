import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import { LoadingPage } from '../../LoadingPage/LoadingPage';

export function PublicOutlet() {
  const { user, loading } = useUser();
  if (loading) {
    return <LoadingPage />;
  }
  return !user ? <Outlet /> : <Navigate to="/" />;
}
