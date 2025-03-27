
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
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
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import PrivilegeTestPage from "./pages/PrivilegeTestPage";
import ClientsPage from "./pages/codebook/ClientsPage";
import InsurersPage from "./pages/codebook/InsurersPage";
import ProductsPage from "./pages/codebook/ProductsPage";
import ClientDetailPage from "./pages/codebook/ClientDetailPage";
import InsurerDetailPage from "./pages/codebook/InsurerDetailPage";
import ProductDetailPage from "./pages/codebook/ProductDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Dashboard */}
                <Route path="/" element={
                  <ProtectedRoute requiredPrivilege="dashboard:view">
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* User Profile - accessible to all authenticated users */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Policies Module */}
                <Route path="/policies" element={
                  <ProtectedRoute requiredPrivilege="policies:view">
                    <AppLayout>
                      <Policies />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Sub-routes for Policies would be defined here */}
                
                {/* Sales Module */}
                <Route path="/sales" element={
                  <ProtectedRoute requiredPrivilege="sales:view">
                    <AppLayout>
                      <Sales />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Claims Module */}
                <Route path="/claims" element={
                  <ProtectedRoute requiredPrivilege="claims:view">
                    <AppLayout>
                      <Claims />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Finances Module */}
                <Route path="/finances" element={
                  <ProtectedRoute requiredPrivilege="finances:view">
                    <AppLayout>
                      <Finances />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Codebook Module and sub-routes */}
                <Route path="/codebook" element={
                  <ProtectedRoute requiredPrivilege="codebook:view">
                    <AppLayout>
                      <Codebook />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/codebook/clients" element={
                  <ProtectedRoute requiredPrivilege="codebook.clients:view">
                    <AppLayout>
                      <ClientsPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/codebook/clients/:clientId" element={
                  <ProtectedRoute requiredPrivilege="codebook.clients:view">
                    <AppLayout>
                      <ClientDetailPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/codebook/companies" element={
                  <ProtectedRoute requiredPrivilege="codebook.companies:view">
                    <AppLayout>
                      <InsurersPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/codebook/companies/:insurerId" element={
                  <ProtectedRoute requiredPrivilege="codebook.companies:view">
                    <AppLayout>
                      <InsurerDetailPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/codebook/products" element={
                  <ProtectedRoute requiredPrivilege="codebook.codes:view">
                    <AppLayout>
                      <ProductsPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/codebook/products/:productId" element={
                  <ProtectedRoute requiredPrivilege="codebook.codes:view">
                    <AppLayout>
                      <ProductDetailPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Agent Module */}
                <Route path="/agent" element={
                  <ProtectedRoute requiredPrivilege="agent:view">
                    <AppLayout>
                      <Agent />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Reports Module */}
                <Route path="/reports" element={
                  <ProtectedRoute requiredPrivilege="reports:view">
                    <AppLayout>
                      <Reports />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Settings Module */}
                <Route path="/settings" element={
                  <ProtectedRoute requiredPrivilege="settings:view">
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* User Management */}
                <Route path="/settings/users" element={
                  <ProtectedRoute requiredPrivilege="users:manage">
                    <AppLayout>
                      <UserManagement />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Privilege Test Page */}
                <Route path="/settings/privileges/test" element={
                  <ProtectedRoute requiredPrivilege="settings:view">
                    <AppLayout>
                      <PrivilegeTestPage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
