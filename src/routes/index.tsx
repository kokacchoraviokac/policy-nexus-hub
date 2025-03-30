
import React from "react";
import { Route } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";
import { DashboardRoutes } from "./DashboardRoutes";
import { PolicyRoutes } from "./PolicyRoutes";
import { ModuleRoutes } from "./ModuleRoutes";
import { CodebookRoutes } from "./CodebookRoutes";
import { SettingsRoutes } from "./SettingsRoutes";

// Combine all routes into a single array
// NOTE: PolicyRoutes needs to be wrapped in a Route component, unlike the others which are already Route components
export const AppRoutes = [
  ...AuthRoutes,
  ...DashboardRoutes,
  <Route key="policy-routes" path={PolicyRoutes.path} >
    {PolicyRoutes.children.map((route, index) => (
      <Route
        key={`policy-route-${index}`}
        index={route.index}
        path={route.path}
        element={route.element}
      />
    ))}
  </Route>,
  ...ModuleRoutes,
  ...CodebookRoutes,
  ...SettingsRoutes
];
