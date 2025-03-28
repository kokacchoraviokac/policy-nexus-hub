
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Codebook from "@/pages/Codebook";
import ClientsPage from "@/pages/codebook/ClientsPage";
import ClientDetailPage from "@/pages/codebook/ClientDetailPage";
import InsurersPage from "@/pages/codebook/InsurersPage";
import InsurerDetailPage from "@/pages/codebook/InsurerDetailPage";
import ProductsPage from "@/pages/codebook/ProductsPage";
import ProductDetailPage from "@/pages/codebook/ProductDetailPage";

export const CodebookRoutes = [
  // Codebook Module
  <Route 
    key="codebook"
    path="/codebook" 
    element={
      <ProtectedRoute requiredPrivilege="codebook:view">
        <AppLayout>
          <Codebook />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Clients
  <Route 
    key="codebook-clients"
    path="/codebook/clients" 
    element={
      <ProtectedRoute requiredPrivilege="codebook.clients:view">
        <AppLayout>
          <ClientsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  <Route 
    key="codebook-client-detail"
    path="/codebook/clients/:clientId" 
    element={
      <ProtectedRoute requiredPrivilege="codebook.clients:view">
        <AppLayout>
          <ClientDetailPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Insurers/Companies
  <Route 
    key="codebook-companies"
    path="/codebook/companies" 
    element={
      <ProtectedRoute requiredPrivilege="codebook.companies:view">
        <AppLayout>
          <InsurersPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  <Route 
    key="codebook-company-detail"
    path="/codebook/companies/:insurerId" 
    element={
      <ProtectedRoute requiredPrivilege="codebook.companies:view">
        <AppLayout>
          <InsurerDetailPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Products
  <Route 
    key="codebook-products"
    path="/codebook/products" 
    element={
      <ProtectedRoute requiredPrivilege="codebook.codes:view">
        <AppLayout>
          <ProductsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  <Route 
    key="codebook-product-detail"
    path="/codebook/products/:productId" 
    element={
      <ProtectedRoute requiredPrivilege="codebook.codes:view">
        <AppLayout>
          <ProductDetailPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
