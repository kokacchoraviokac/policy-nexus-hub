
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import DemoAccounts from "@/components/auth/DemoAccounts";
import LanguageSelector from "@/components/language/LanguageSelector";

const Login = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  const from = location.state?.from?.pathname || "/";

  // If already authenticated, redirect to the home page
  if (isAuthenticated && !isLoading) {
    return <Navigate to={from} replace />;
  }

  return (
    <>
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="default" />
      </div>
      
      <AuthCard 
        title={t("welcome")} 
        description={t("signInDescription")}
        footer={<DemoAccounts />}
      >
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">{t("login")}</TabsTrigger>
            <TabsTrigger value="signup">{t("signUp")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignupForm onSuccess={() => setActiveTab("login")} />
          </TabsContent>
        </Tabs>
      </AuthCard>
    </>
  );
};

export default Login;
