
import React from "react";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import { useLanguage } from "@/contexts/LanguageContext";
import DemoAccounts from "@/components/auth/DemoAccounts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Login: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <div className="mb-4">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToHome")}
            </Link>
          </Button>
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
      </div>
    </div>
  );
};

export default Login;
