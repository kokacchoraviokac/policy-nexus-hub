
import React from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FinancesPage from "@/pages/finances/FinancesPage";
import CommissionsPage from "@/pages/finances/CommissionsPage";
import InvoicingPage from "@/pages/finances/InvoicingPage";
import StatementProcessingPage from "@/pages/finances/StatementProcessingPage";
import UnlinkedPaymentsPage from "@/pages/finances/UnlinkedPaymentsPage";
import BankStatementsPage from "@/pages/finances/BankStatementsPage";
import BankStatementDetailPage from "@/pages/finances/BankStatementDetailPage";

export const FinancesRoutes = [
  <Route
    key="finances"
    path="/finances"
    element={
      <ProtectedRoute>
        <AppLayout>
          <FinancesPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="finances-commissions"
    path="/finances/commissions"
    element={
      <ProtectedRoute>
        <AppLayout>
          <CommissionsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="finances-invoicing"
    path="/finances/invoicing"
    element={
      <ProtectedRoute>
        <AppLayout>
          <InvoicingPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="finances-statement-processing"
    path="/finances/statement-processing"
    element={
      <ProtectedRoute>
        <AppLayout>
          <StatementProcessingPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="finances-statements"
    path="/finances/statements"
    element={
      <ProtectedRoute>
        <AppLayout>
          <BankStatementsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="finances-statement-detail"
    path="/finances/statements/:statementId"
    element={
      <ProtectedRoute>
        <AppLayout>
          <BankStatementDetailPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="finances-unlinked-payments"
    path="/finances/unlinked-payments"
    element={
      <ProtectedRoute>
        <AppLayout>
          <UnlinkedPaymentsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
