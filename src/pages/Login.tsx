
import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  // If already authenticated, redirect to the home page
  if (isAuthenticated && !isLoading) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast.success("Login successful");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Invalid email or password");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-xl animate-enter">
        <CardHeader className="space-y-1">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Policy<span className="text-primary">Hub</span>
            </h2>
          </div>
          <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" size="sm" className="px-0 font-normal h-auto">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-4">
            <div className="mb-2">
              Demo Accounts:
            </div>
            <div className="grid grid-cols-1 gap-1">
              <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-xs">
                superadmin@policyhub.com (Super Admin)
              </code>
              <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-xs">
                admin@example.com (Broker Admin)
              </code>
              <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-xs">
                employee@example.com (Employee)
              </code>
            </div>
            <div className="mt-2 text-xs">
              Password: any (authentication is mocked)
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
