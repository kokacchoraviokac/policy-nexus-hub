
import React, { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import Logo from "@/components/ui/logo";

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
  const { t } = useLanguage();

  return (
    <Card className="w-full max-w-md shadow-xl animate-enter">
      <CardHeader className="space-y-1">
        <div className="flex justify-center items-center mb-4">
          <Logo className="h-10 w-auto" />
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
  );
};

export default AuthCard;
