import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Routes, Route } from "react-router-dom";
import { AppRoutes } from "./routes";

const App = () => (
  <>
    <Toaster />
    <Sonner />
    <Routes>
      {AppRoutes.map((route, index) => {
        // If the route is a simple Route element, return it directly
        if (React.isValidElement(route)) {
          return route;
        }
        
        // Otherwise, it's a route configuration object
        // Recursively render its children
        if ('path' in route && 'children' in route) {
          return (
            <Route key={index} path={route.path}>
              {route.children.map((child, childIndex) => {
                if ('index' in child && child.index) {
                  return <Route index key={`${index}-${childIndex}`} element={child.element} />;
                }
                return <Route key={`${index}-${childIndex}`} path={child.path} element={child.element} />;
              })}
            </Route>
          );
        }
        
        return null;
      })}
    </Routes>
  </>
);

export default App;
