import {getCurrentUser } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      await getCurrentUser();
     
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return (
    <main className="w-full h-screen grid place-items-center">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
