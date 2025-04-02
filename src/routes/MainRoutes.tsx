
import React from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { ModuleRoutes } from "./ModuleRoutes";
import Index from "@/pages/Index";

const MainRoutes = [
  <Route key="index" path="/" element={<Index />} />,
  ...ModuleRoutes.map(route => (
    <Route
      key={route.props.path}
      path={route.props.path}
      element={<AppLayout>{route.props.element}</AppLayout>}
    />
  ))
];

export default MainRoutes;
