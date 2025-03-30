
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClaimLoadingProps {
  isLoading: boolean;
}

export const ClaimLoading: React.FC<ClaimLoadingProps> = ({ isLoading }) => {
  const { t } = useLanguage();

  if (!isLoading) return null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-24" />
      </div>
      
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="space-y-2">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ClaimErrorProps {
  isError: boolean;
}

export const ClaimError: React.FC<ClaimErrorProps> = ({ isError }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!isError) return null;

  const handleBack = () => {
    navigate("/claims");
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-lg font-medium mb-2">{t("errorLoadingClaim")}</h2>
        <p className="text-muted-foreground mb-6">
          {t("claimNotFoundOrError")}
        </p>
        <Button onClick={handleBack}>
          {t("goBack")}
        </Button>
      </div>
    </div>
  );
};
