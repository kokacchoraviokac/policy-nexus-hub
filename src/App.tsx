
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route path="/" element={
              <ProtectedRoute requiredPrivilege="dashboard:view">
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/policies" element={
              <ProtectedRoute requiredPrivilege="policies:view">
                <AppLayout>
                  <Policies />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/sales" element={
              <ProtectedRoute requiredPrivilege="sales:view">
                <AppLayout>
                  <Sales />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/claims" element={
              <ProtectedRoute requiredPrivilege="claims:view">
                <AppLayout>
                  <Claims />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/finances" element={
              <ProtectedRoute requiredPrivilege="finances:view">
                <AppLayout>
                  <Finances />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/codebook" element={
              <ProtectedRoute requiredPrivilege="codebook:view">
                <AppLayout>
                  <Codebook />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/agent" element={
              <ProtectedRoute requiredPrivilege="agent:view">
                <AppLayout>
                  <Agent />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute requiredPrivilege="reports:view">
                <AppLayout>
                  <Reports />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requiredPrivilege="settings:view">
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
