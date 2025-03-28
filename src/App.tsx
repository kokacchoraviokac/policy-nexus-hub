
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Routes } from "react-router-dom";
import { AppRoutes } from "./routes";

const App = () => (
  <>
    <Toaster />
    <Sonner />
    <Routes>
      {AppRoutes}
    </Routes>
  </>
);

export default App;
