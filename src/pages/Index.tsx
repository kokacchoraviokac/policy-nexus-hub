
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      // If authenticated, redirect to dashboard
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // This return will only show briefly during redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-pulse">
          <h1 className="text-2xl font-medium mb-2">
            Policy<span className="text-[#c76449]">Hub</span>
          </h1>
          <p className="text-muted-foreground">{t("redirecting")}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
