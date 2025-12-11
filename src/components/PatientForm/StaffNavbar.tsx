// src/components/StaffNavbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export const StaffNavbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="w-full border-b bg-background">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left – App name / logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="font-semibold text-lg">
            MCFC Intake
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Staff Portal
          </span>
        </div>

        {/* Center – Nav links */}
        <div className="flex items-center gap-4 text-sm">
          <Link to="/search" className="hover:text-primary transition-colors">
            Search Patients
          </Link>
          <Link to="/patients" className="hover:text-primary transition-colors">
            All Patients
          </Link>
        </div>

        {/* Right – user + logout */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Signed in as <span className="font-medium">{user.email}</span>
            </span>
          )}
          {user ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Staff Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
