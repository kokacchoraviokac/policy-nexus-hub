
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import TranslationDashboard from "./translation/TranslationDashboard";
import TranslationStatus from "./TranslationStatus";

// Define Language type
type Language = "en" | "sr" | "mk" | "es";

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
  exportLanguage: Language | "all";
  setExportLanguage: (lang: Language | "all") => void;
}

const TranslationManager: React.FC = () => {
  const { t } = useLanguage();
  // Fix: Use the correct Language type for exportLanguage
  const [exportLanguage, setExportLanguage] = useState<Language | "all">("en");

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
      
      {/* WorkflowPanel - Fix adding autoRun prop */}
      <WorkflowPanel autoRun={false} />
    </div>
  );
};

export default TranslationManager;
