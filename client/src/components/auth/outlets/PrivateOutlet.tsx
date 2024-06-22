import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { useEffect } from "react";

function NavigateToLogin() {
  const location = useLocation();
  return <Navigate to="/login" state={{ locationFrom: location.pathname }} />;
}

export function PrivateOutlet() {
  useEffect(() => {
    console.log("Rendering Private");
  }, []);

  const { user } = useUser();
  return user ? <Outlet /> : <NavigateToLogin />;
}
