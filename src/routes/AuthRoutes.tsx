
import React from "react";
import { Route } from "react-router-dom";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";

export const AuthRoutes = [
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="reset-password" path="/reset-password" element={<ResetPassword />} />,
  <Route key="unauthorized" path="/unauthorized" element={<Unauthorized />} />,
  <Route key="not-found" path="*" element={<NotFound />} />
];
