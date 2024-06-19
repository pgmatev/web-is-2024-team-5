import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

export function PublicOutlet() {
  const { user } = useUser();
  return !user ? <Outlet /> : <Navigate to="/" />;
}
