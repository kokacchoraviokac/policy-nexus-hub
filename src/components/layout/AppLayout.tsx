
import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BreadcrumbNav from "./BreadcrumbNav";
import Footer from "./Footer";

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar - independently scrollable */}
      <Sidebar />
      
      {/* Main content + fixed footer */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        
        <div className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-0"
        )}>
          <BreadcrumbNav />
        </div>
        
        {/* Scrollable main content */}
        <main className={cn(
          "flex-1 overflow-auto transition-all duration-300 animate-enter",
          sidebarCollapsed ? "lg:pl-24" : "lg:pl-6"
        )}>
          <div className="p-6 flex-1">
            {children || <Outlet />}
          </div>
        </main>
        
        {/* Fixed footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
