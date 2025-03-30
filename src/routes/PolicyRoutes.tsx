import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

// Policy Pages
import AllPolicies from "@/pages/policies/AllPolicies";
import PolicyDetail from "@/pages/policies/PolicyDetail";
import PolicyAddendums from "@/pages/policies/PolicyAddendums";
import UnlinkedPayments from "@/pages/policies/UnlinkedPayments";
import PolicyDocuments from "@/pages/policies/PolicyDocuments";
import PolicyWorkflow from "@/pages/policies/workflow/PolicyWorkflow";
import PolicyReview from "@/pages/policies/workflow/PolicyReview";

// Finance Pages
import FinancesModule from "@/pages/finances/FinancesModule";
import Commissions from "@/pages/finances/Commissions";
import BankStatements from "@/pages/finances/BankStatements";
import BankStatementDetail from "@/pages/finances/BankStatementDetail";

export const PolicyRoutes = [
  // Policy Directory Routes
  <Route
    key="policies"
    path="/policies"
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <AllPolicies />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policy-detail"
    path="/policies/:policyId"
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyDetail />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Workflow Routes
  <Route
    key="policy-workflow"
    path="/policies/workflow"
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyWorkflow />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policy-review"
    path="/policies/workflow/:policyId"
    element={
      <ProtectedRoute requiredPrivilege="policies:edit">
        <AppLayout>
          <PolicyReview />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Addendums Route
  <Route
    key="policy-addendums"
    path="/policies/addendums"
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyAddendums />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Unlinked Payments Route
  <Route
    key="unlinked-payments"
    path="/policies/unlinked-payments"
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <UnlinkedPayments />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Documents Route
  <Route
    key="policy-documents"
    path="/policies/documents"
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyDocuments />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Finances Routes
  <Route
    key="finances-base"
    path="/finances"
    element={
      <ProtectedRoute requiredPrivilege="finances:view">
        <AppLayout>
          <FinancesModule />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="finances-commissions"
    path="/finances/commissions"
    element={
      <ProtectedRoute requiredPrivilege="finances:view">
        <AppLayout>
          <Commissions />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="finances-statements"
    path="/finances/statements"
    element={
      <ProtectedRoute requiredPrivilege="finances:view">
        <AppLayout>
          <BankStatements />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="finances-statement-detail"
    path="/finances/statements/:statementId"
    element={
      <ProtectedRoute requiredPrivilege="finances:view">
        <AppLayout>
          <BankStatementDetail />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  <Route
    key="finances-unlinked-payments"
    path="/finances/unlinked-payments"
    element={
      <ProtectedRoute requiredPrivilege="finances:view">
        <AppLayout>
          <UnlinkedPayments />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];

export default PolicyRoutes;
