
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface BackToPoliciesButtonProps {
  onClick: () => void;
}

const BackToPoliciesButton: React.FC<BackToPoliciesButtonProps> = ({ onClick }) => {
  const { t } = useLanguage();

  return (
    <Button variant="ghost" onClick={onClick} className="group">
      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {t("backToPolicies")}
    </Button>
  );
};

export default BackToPoliciesButton;
