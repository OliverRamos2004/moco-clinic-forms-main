// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  if (!user) {
    // Not logged in → redirect to login, preserve where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated → render the actual page
  return <>{children}</>;
};

export default ProtectedRoute;
