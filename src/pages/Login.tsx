
import React, { useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useLanguage } from "@/contexts/LanguageContext";
import DemoAccounts from "@/components/auth/DemoAccounts";
import TranslationStatus from "@/components/language/TranslationStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { t } = useLanguage();
  const isDevelopment = process.env.NODE_ENV === "development";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        {/* Auth Card with Tabs */}
        <AuthCard
          title={activeTab === "login" ? t("loginToYourAccount") : t("createAccount")}
          description={activeTab === "login" ? t("enterYourCredentials") : t("signUpDescription")}
        >
          <Tabs 
            defaultValue="login" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "signup")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="login">{t("login")}</TabsTrigger>
              <TabsTrigger value="signup">{t("signUp")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
              
              {/* Demo Account Section */}
              <div className="mt-6 pt-6 border-t">
                <DemoAccounts />
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        </AuthCard>

        {/* Translation Status - Only visible in development */}
        {isDevelopment && (
          <div className="mt-6 opacity-70 hover:opacity-100 transition-opacity">
            <TranslationStatus />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
