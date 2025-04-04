
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If authentication is not loading
    if (!isLoading) {
      // If not authenticated, redirect to login page
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        // If authenticated, redirect to dashboard
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  // This return will show during loading and briefly during redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-medium mb-2">
            Policy<span className="text-[#c76449]">Hub</span>
          </h1>
          <Loader2 className="h-8 w-8 animate-spin text-primary mt-4" />
          <p className="text-muted-foreground mt-4">{t("redirecting") || "Redirecting..."}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
