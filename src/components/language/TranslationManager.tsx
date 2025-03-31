
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import TranslationDashboard from "./translation/TranslationDashboard";
import TranslationStatus from "./TranslationStatus";

// We need to fix the props type for the WorkflowPanel component
interface WorkflowPanelProps {
  autoRun?: boolean;
}

const WorkflowPanel: React.FC<WorkflowPanelProps> = ({ autoRun = false }) => {
  const { t } = useLanguage();

  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-semibold mb-4">{t("workflowPanel")}</h3>
      <p className="text-muted-foreground">{t("workflowPanelDescription")}</p>
      <p>Auto Run: {autoRun ? "Yes" : "No"}</p>
    </div>
  );
};

// Add props for TranslationDashboard
interface TranslationDashboardProps {
  exportLanguage: string;
  setExportLanguage: (lang: string) => void;
}

const TranslationManager: React.FC = () => {
  const { t } = useLanguage();
  const [exportLanguage, setExportLanguage] = useState("en");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("translationManager")}</h2>
      
      {/* Status */}
      <TranslationStatus />
      
      {/* Dashboard */}
      <TranslationDashboard 
        exportLanguage={exportLanguage} 
        setExportLanguage={setExportLanguage} 
      />
      
      {/* WorkflowPanel */}
      <WorkflowPanel autoRun={false} />
    </div>
  );
};

export default TranslationManager;
