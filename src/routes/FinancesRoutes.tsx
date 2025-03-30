
import React from "react";
import { Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import BankStatements from "@/pages/finances/BankStatements";
import BankStatementDetail from "@/pages/finances/BankStatementDetail";
import Commissions from "@/pages/finances/Commissions";
import FinancesModule from "@/pages/finances/FinancesModule";
import UnlinkedPayments from "@/pages/finances/UnlinkedPayments";

export const FinancesRoutes = [
  // Redirect from main finances page to commissions (first sub-item)
  <Route 
    key="finances-redirect"
    path="/finances" 
    element={
      <Navigate to="/finances/commissions" replace />
    }
  />,
  
  // Commissions
  <Route 
    key="finances-commissions"
    path="/finances/commissions" 
    element={
      <ProtectedRoute requiredPrivilege="finances.commissions:view">
        <AppLayout>
          <Commissions />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Invoicing
  <Route 
    key="finances-invoicing"
    path="/finances/invoicing" 
    element={
      <ProtectedRoute requiredPrivilege="finances.invoicing:view">
        <AppLayout>
          <FinancesModule title="invoicing" />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Bank Statements listing
  <Route 
    key="finances-statements"
    path="/finances/statements" 
    element={
      <ProtectedRoute requiredPrivilege="finances.statements:view">
        <AppLayout>
          <BankStatements />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Bank Statement detail view
  <Route 
    key="finances-statement-detail"
    path="/finances/statements/:statementId" 
    element={
      <ProtectedRoute requiredPrivilege="finances.statements:view">
        <AppLayout>
          <BankStatementDetail />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Unlinked payments
  <Route 
    key="finances-unlinked-payments"
    path="/finances/unlinked-payments" 
    element={
      <ProtectedRoute requiredPrivilege="finances.payments:view">
        <AppLayout>
          <UnlinkedPayments />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];

export default FinancesRoutes;
