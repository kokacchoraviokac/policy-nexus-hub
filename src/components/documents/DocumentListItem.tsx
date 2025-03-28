
import React from "react";
import { Document } from "@/hooks/useDocuments";
import { Card, CardContent } from "@/components/ui/card";
import { getDocumentIcon } from "@/utils/documentIconUtils";
import DocumentMetadata from "./DocumentMetadata";
import DocumentActions from "./DocumentActions";

interface DocumentListItemProps {
  document: Document;
  onDelete: () => void;
  isDeleting?: boolean;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDelete,
  isDeleting = false
}) => {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {getDocumentIcon(document.file_path, document.mime_type)}
          
          <DocumentMetadata document={document} />
          
          <DocumentActions 
            document={document}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentListItem;
