
import React from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AgentPage from "@/pages/agent/AgentPage";
import FixedCommissionsPage from "@/pages/agent/FixedCommissionsPage";
import ClientCommissionsPage from "@/pages/agent/ClientCommissionsPage";
import ManualCommissionsPage from "@/pages/agent/ManualCommissionsPage";
import CalculatePayoutsPage from "@/pages/agent/CalculatePayoutsPage";
import PayoutReportsPage from "@/pages/agent/PayoutReportsPage";
import AgentsListPage from "@/pages/agent/AgentsListPage";

export const AgentRoutes = [
  <Route
    key="agent"
    path="/agent"
    element={
      <ProtectedRoute>
        <AppLayout>
          <AgentPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="agent-list"
    path="/agent/agents"
    element={
      <ProtectedRoute>
        <AppLayout>
          <AgentsListPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="agent-fixed-commissions"
    path="/agent/fixed-commissions"
    element={
      <ProtectedRoute>
        <AppLayout>
          <FixedCommissionsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="agent-client-commissions"
    path="/agent/client-commissions"
    element={
      <ProtectedRoute>
        <AppLayout>
          <ClientCommissionsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="agent-manual-commissions"
    path="/agent/manual-commissions"
    element={
      <ProtectedRoute>
        <AppLayout>
          <ManualCommissionsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="agent-calculate-payouts"
    path="/agent/calculate-payouts"
    element={
      <ProtectedRoute>
        <AppLayout>
          <CalculatePayoutsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="agent-payout-reports"
    path="/agent/payout-reports"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PayoutReportsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
