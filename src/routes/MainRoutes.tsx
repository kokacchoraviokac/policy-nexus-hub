
import React from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { ModuleRoutes } from "./ModuleRoutes";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

const MainRoutes = [
  <Route key="dashboard" path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />,
  ...ModuleRoutes.map(route => (
    <Route
      key={route.props.path}
      path={route.props.path}
      element={<AppLayout>{route.props.element}</AppLayout>}
    />
  )),
  <Route key="not-found" path="*" element={<AppLayout><NotFound /></AppLayout>} />
];

export default MainRoutes;
