
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
import TranslationTestStatus from "@/components/language/TranslationTestStatus";

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
    <div className="min-h-screen flex flex-col relative bg-gray-50">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0">
        {/* Remove the variant prop */}
        <LanguageSelector />
      </div>
      
      <div className="flex items-center justify-center flex-grow px-4">
        <div className="w-full max-w-md">
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
          
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-4">
              <TranslationTestStatus />
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
        © {new Date().getFullYear()} PolicyHub. {t("allRightsReserved")}
      </div>
    </div>
  );
};

export default Login;
