
import React from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import FinancesPage from "@/pages/finances/FinancesPage";
import CommissionsPage from "@/pages/finances/CommissionsPage";
import InvoicingPage from "@/pages/finances/InvoicingPage";
import StatementProcessingPage from "@/pages/finances/StatementProcessingPage";
import UnlinkedPaymentsPage from "@/pages/finances/UnlinkedPaymentsPage";

export const FinancesRoutes = (
  <>
    <Route
      path="/finances"
      element={
        <ProtectedRoute>
          <AppLayout>
            <FinancesPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/finances/commissions"
      element={
        <ProtectedRoute>
          <AppLayout>
            <CommissionsPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/finances/invoicing"
      element={
        <ProtectedRoute>
          <AppLayout>
            <InvoicingPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/finances/statement-processing"
      element={
        <ProtectedRoute>
          <AppLayout>
            <StatementProcessingPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/finances/unlinked-payments"
      element={
        <ProtectedRoute>
          <AppLayout>
            <UnlinkedPaymentsPage />
          </AppLayout>
        </ProtectedRoute>
      }
    />
  </>
);
