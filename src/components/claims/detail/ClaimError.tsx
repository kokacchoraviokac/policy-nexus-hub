
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface ClaimErrorProps {
  isError: boolean;
}

const ClaimError: React.FC<ClaimErrorProps> = ({ isError }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  if (!isError) return null;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">{t("errorLoadingClaim")}</h2>
            <p className="text-muted-foreground max-w-md">
              {t("claimNotFoundOrError")}
            </p>
            <Button onClick={() => navigate("/claims")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("goBack")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ClaimError };
