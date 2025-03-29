
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocuments } from "@/hooks/useDocuments";
import { Policy } from "@/types/policies";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PolicyDocumentsCheckProps {
  policy: Policy;
  onUploadClick: () => void;
}

const PolicyDocumentsCheck: React.FC<PolicyDocumentsCheckProps> = ({ policy, onUploadClick }) => {
  const { t } = useLanguage();
  const { documents = [], isLoading } = useDocuments({
    entityType: "policy",
    entityId: policy.id
  });

  const documentCount = documents.length;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t("documentsCheck")}</h3>
      
      <div className="flex justify-between items-center">
        <div>
          {documentCount > 0 ? (
            <span className="flex items-center">
              <Badge variant="secondary" className="mr-2">
                {documentCount}
              </Badge>
              {t("documentsAttached", { count: documentCount })}
            </span>
          ) : (
            <span className="text-muted-foreground">{t("noDocuments")}</span>
          )}
        </div>
        
        <Button size="sm" onClick={onUploadClick}>
          <FileUp className="mr-2 h-4 w-4" />
          {t("uploadDocument")}
        </Button>
      </div>
    </div>
  );
};

export default PolicyDocumentsCheck;
