import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PatientsList } from "./pages/PatientsList";
import { supabase } from "./lib/supabaseClient";
import { PatientDetails } from "./pages/PatientDetails";
import PatientSearchPage from "./pages/PatientSearchPage"; // adjust path if needed

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const testSupabase = async () => {
      const { data, error } = await supabase
        .from("person")
        .select("*")
        .limit(1);

      if (error) {
        console.error("❌ Supabase connection failed:", error.message);
      } else {
        console.log("✅ Supabase connection successful:", data);
      }
    };

    testSupabase();
  }, []); // ✅ runs once on load

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/:person_id" element={<PatientDetails />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/search" element={<PatientSearchPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
