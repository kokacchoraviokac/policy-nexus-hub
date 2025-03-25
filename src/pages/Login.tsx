
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import DemoAccounts from "@/components/auth/DemoAccounts";

const Login = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  const from = location.state?.from?.pathname || "/";

  // If already authenticated, redirect to the home page
  if (isAuthenticated && !isLoading) {
    return <Navigate to={from} replace />;
  }

  return (
    <AuthCard 
      title="Welcome" 
      description="Sign in to your account or create a new one"
      footer={<DemoAccounts />}
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupForm onSuccess={() => setActiveTab("login")} />
        </TabsContent>
      </Tabs>
    </AuthCard>
  );
};

export default Login;
