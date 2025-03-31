
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Loader2, FileWarning } from "lucide-react";

interface ClaimLoadingProps {
  isLoading: boolean;
}

export const ClaimLoading: React.FC<ClaimLoadingProps> = ({ isLoading }) => {
  const { t } = useLanguage();
  
  if (!isLoading) return null;
  
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t("loadingClaim")}</h2>
        <p className="text-muted-foreground">{t("pleaseWait")}</p>
      </div>
    </Card>
  );
};

interface ClaimErrorProps {
  isError: boolean;
}

export const ClaimError: React.FC<ClaimErrorProps> = ({ isError }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  if (!isError) return null;
  
  const handleGoBack = () => {
    navigate("/claims");
  };
  
  const handleTryAgain = () => {
    window.location.reload();
  };
  
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center py-12">
        <FileWarning className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t("errorLoadingClaim")}</h2>
        <p className="text-muted-foreground mb-6">{t("claimNotFoundOrError")}</p>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("goBack")}
          </Button>
          <Button onClick={handleTryAgain}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("tryAgain")}
          </Button>
        </div>
      </div>
    </Card>
  );
};
