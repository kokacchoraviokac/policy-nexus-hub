
import React, { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  title, 
  description, 
  children, 
  footer 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-xl animate-enter">
        <CardHeader className="space-y-1">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Policy<span className="text-primary">Hub</span>
            </h2>
          </div>
          <CardTitle className="text-2xl text-center">{title}</CardTitle>
          {description && (
            <CardDescription className="text-center">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footer && (
          <CardFooter className="flex flex-col">
            {footer}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AuthCard;
