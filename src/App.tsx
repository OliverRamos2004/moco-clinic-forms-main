import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient"; // ✅ import Supabase client

const queryClient = new QueryClient();

const App = () => {
  // ✅ Run this once when the app loads
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
