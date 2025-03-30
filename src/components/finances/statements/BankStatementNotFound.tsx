
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const BankStatementNotFound: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={() => navigate("/finances/statements")}
      >
        {t("backToStatements")}
      </Button>
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <h2 className="text-xl font-semibold mb-2">{t("statementNotFound")}</h2>
          <p className="text-muted-foreground mb-4">{t("statementNotFoundDescription")}</p>
          <Button onClick={() => navigate("/finances/statements")}>
            {t("backToStatements")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankStatementNotFound;
