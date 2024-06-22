import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { useEffect } from "react";

export function PublicOutlet() {
  useEffect(() => {
    console.log("Rendering Public");
  }, []);

  const { user } = useUser();
  return !user ? <Outlet /> : <Navigate to="/" />;
}
