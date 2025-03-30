
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileX } from "lucide-react";

const BankStatementNotFound: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <FileX className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">{t("statementNotFound")}</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        {t("statementNotFoundDescription")}
      </p>
      <Button onClick={() => navigate("/finances/statements")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("backToStatements")}
      </Button>
    </div>
  );
};

export default BankStatementNotFound;
