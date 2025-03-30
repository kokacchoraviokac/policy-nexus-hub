
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import ClaimsPage from "@/pages/Claims";
import ClaimDetailPage from "@/pages/claims/ClaimDetailPage";
import NewClaimPage from "@/pages/claims/NewClaimPage";

export const ClaimsRoutes = [
  // Main claims page
  <Route 
    key="claims-main"
    path="/claims" 
    element={
      <ProtectedRoute requiredPrivilege="claims:view">
        <AppLayout>
          <ClaimsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // New claim page
  <Route 
    key="claims-new"
    path="/claims/new" 
    element={
      <ProtectedRoute requiredPrivilege="claims:create">
        <AppLayout>
          <NewClaimPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Claim detail page
  <Route 
    key="claim-detail"
    path="/claims/:claimId" 
    element={
      <ProtectedRoute requiredPrivilege="claims:view">
        <AppLayout>
          <ClaimDetailPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
