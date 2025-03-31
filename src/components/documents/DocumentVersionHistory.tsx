
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDocumentVersions } from "@/services/DocumentVersionsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";

interface DocumentVersionHistoryProps {
  documentId: string;
  originalDocumentId?: string | null;
}

const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  documentId,
  originalDocumentId
}) => {
  const { t, formatDate } = useLanguage();
  const { isDownloading, downloadDocument } = useDocumentDownload();
  
  const { data: versions, isLoading, error } = useQuery({
    queryKey: ['document-versions', originalDocumentId || documentId],
    queryFn: () => getDocumentVersions(documentId, originalDocumentId || undefined),
    enabled: !!documentId
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 flex justify-center items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">{t("loading")}</span>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !versions || versions.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            {error 
              ? t("errorLoadingVersions")
              : t("noVersionsAvailable")}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Sort versions by version number (descending)
  const sortedVersions = [...versions].sort((a, b) => 
    (b.version || 1) - (a.version || 1)
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <History className="h-4 w-4 mr-2" />
          {t("versionHistory")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {sortedVersions.map((version) => (
            <div
              key={version.id}
              className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium flex items-center">
                  {t("version")} {version.version || 1}
                  {version.is_latest_version && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                      {t("latest")}
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => downloadDocument(version)}
                disabled={isDownloading}
              >
                <FileDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentVersionHistory;
