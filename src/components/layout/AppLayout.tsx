
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import BreadcrumbNav from "./BreadcrumbNav";
import Footer from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
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
    <div className="h-screen w-full bg-background flex overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
        
        <div className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-0"
        )}>
          <BreadcrumbNav />
        </div>
        
        <main className={cn(
          "flex-1 overflow-auto transition-all duration-300 animate-enter",
          sidebarCollapsed ? "lg:pl-24" : "lg:pl-6"
        )}>
          <div className="p-6 flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
