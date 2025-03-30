
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClaimLoadingProps {
  isLoading: boolean;
}

export const ClaimLoading: React.FC<ClaimLoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex justify-center items-center h-96">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

interface ClaimErrorProps {
  isError: boolean;
}

export const ClaimError: React.FC<ClaimErrorProps> = ({ isError }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  if (!isError) return null;
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold">{t("errorLoadingClaim")}</h2>
          <p className="text-muted-foreground mt-2">{t("claimNotFoundOrError")}</p>
          <Button className="mt-6" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("goBack")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
