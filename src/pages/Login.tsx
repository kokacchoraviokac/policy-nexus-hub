
import React from "react";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import { useLanguage } from "@/contexts/LanguageContext";
import DemoAccounts from "@/components/auth/DemoAccounts";
import TranslationStatus from "@/components/language/TranslationStatus";
import Logo from "@/components/ui/logo";

const Login: React.FC = () => {
  const { t } = useLanguage();
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo className="h-12 w-auto" />
        </div>
        
        {/* Login Card */}
        <AuthCard
          title={t("loginToYourAccount")}
          description={t("enterYourCredentials")}
        >
          <LoginForm />

          {/* Demo Account Section */}
          <div className="mt-6 pt-6 border-t">
            <DemoAccounts />
          </div>
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
