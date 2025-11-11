import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PatientsList } from "./pages/PatientsList"; // ✅ your patients page
import { supabase } from "./lib/supabaseClient"; // ✅ Supabase client

const queryClient = new QueryClient();

const App = () => {
  // Optional: test Supabase connection once
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from("person")
          .select("*")
          .limit(1);
        if (error) {
          console.error("❌ Supabase connection failed:", error.message);
        } else {
          console.log("✅ Supabase connection successful:", data);
        }
      } catch (err) {
        console.error("❌ Error testing Supabase connection:", err);
      }
    };
    testConnection();
  }, []);

  // ✅ All routes must be inside the <BrowserRouter> and inside the return()
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/patients" element={<PatientsList />} />{" "}
            {/* ✅ added here */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
