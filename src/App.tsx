
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Policies from "./pages/Policies";
import Sales from "./pages/Sales";
import Claims from "./pages/Claims";
import Finances from "./pages/Finances";
import Codebook from "./pages/Codebook";
import Agent from "./pages/Agent";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/policies" element={
            <AppLayout>
              <Policies />
            </AppLayout>
          } />
          <Route path="/sales" element={
            <AppLayout>
              <Sales />
            </AppLayout>
          } />
          <Route path="/claims" element={
            <AppLayout>
              <Claims />
            </AppLayout>
          } />
          <Route path="/finances" element={
            <AppLayout>
              <Finances />
            </AppLayout>
          } />
          <Route path="/codebook" element={
            <AppLayout>
              <Codebook />
            </AppLayout>
          } />
          <Route path="/agent" element={
            <AppLayout>
              <Agent />
            </AppLayout>
          } />
          <Route path="/reports" element={
            <AppLayout>
              <Reports />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <Settings />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
