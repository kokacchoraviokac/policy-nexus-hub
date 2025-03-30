
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocumentVersions } from "@/hooks/useDocumentVersions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileHistory, Loader2, AlertCircle } from "lucide-react";
import { Document } from "@/types/documents";
import { formatDate } from "@/utils/format";
import DocumentActions from "./DocumentActions";
import { Badge } from "@/components/ui/badge";

interface DocumentVersionHistoryProps {
  documentId: string;
  originalDocumentId?: string;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  documentId,
  originalDocumentId
}) => {
  const { t } = useLanguage();
  const { 
    versions, 
    isLoading, 
    error, 
    hasMultipleVersions 
  } = useDocumentVersions({
    documentId,
    originalDocumentId
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <AlertCircle className="h-6 w-6 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground">{t("errorLoadingVersions")}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!hasMultipleVersions) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            {t("noVersionsAvailable")}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileHistory className="h-5 w-5" />
          {t("versionHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versions.map((version: Document) => (
            <div 
              key={version.id} 
              className={`p-3 border rounded-md ${version.id === documentId ? 'border-primary bg-primary/5' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t("version")} {version.version}</span>
                    {version.is_latest_version && (
                      <Badge variant="outline" className="bg-primary/10">
                        {t("latest")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(version.created_at)}
                  </p>
                </div>
                <DocumentActions 
                  document={version}
                  onDelete={() => {}} // Version deletion is typically not allowed
                  isDeleting={false}
                  hideDelete={true}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentVersionHistory;
