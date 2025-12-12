import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PatientsList } from "./pages/PatientsList";
import { PatientDetails } from "./pages/PatientDetails";
import PatientSearchPage from "./pages/PatientSearchPage";
import { supabase } from "./lib/supabaseClient";

// 🔐 Auth bits you already created
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => {
  // optional: keep your Supabase connection test
  useEffect(() => {
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from("person")
          .select("*")
          .limit(1);

        if (error) {
          console.error("❌ Supabase connection failed:", error);
        } else {
          console.log("✅ Supabase connection successful:", data);
        }
      } catch (err) {
        console.error("❌ Supabase connection failed:", err);
      }
    };

    testSupabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            {/* Toasts */}
            <Toaster />
            <Sonner />

            <Routes>
              {/* Public – patient intake form */}
              <Route path="/" element={<Index />} />

              {/* Public – staff login */}
              <Route path="/login" element={<Login />} />

              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected – staff-only pages */}
              <Route
                path="/patients"
                element={
                  <ProtectedRoute>
                    <PatientsList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/patients/:person_id"
                element={
                  <ProtectedRoute>
                    <PatientDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <PatientSearchPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
