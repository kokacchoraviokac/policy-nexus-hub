
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/common";

const NewPolicy = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleImportClick = () => {
    // Navigate to the policy import page
    navigate("/policies/import");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/policies")}
          aria-label={t("back")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("newPolicy")}</h1>
          <p className="text-muted-foreground">
            {t("importPolicyDescription") || "Import policies from insurance companies"}
          </p>
        </div>
      </div>

      <Alert variant="warning" className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">{t("policyCreationUpdate") || "Policy Creation Update"}</AlertTitle>
        <AlertDescription className="text-blue-600">
          {t("policyImportOnly") || 
            "According to the updated business logic, new policies are not created manually within Policy Hub; they are generated exclusively by insurance companies and then imported into the system."}
        </AlertDescription>
      </Alert>

      <div className="flex items-center justify-center p-12 bg-white/80 backdrop-blur-sm rounded-lg border border-border">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">{t("importPolicy") || "Import Policy"}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("importPolicyInstruction") || 
              "Click the button below to navigate to the policy import page where you can review and import policies from insurance companies."}
          </p>
          <Button 
            size="lg"
            className="mt-4"
            onClick={handleImportClick}
          >
            {t("goToImport") || "Go to Policy Import"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewPolicy;
