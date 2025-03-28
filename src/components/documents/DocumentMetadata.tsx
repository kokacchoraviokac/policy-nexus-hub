
import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Document } from "@/hooks/useDocuments";

interface DocumentMetadataProps {
  document: Document;
}

const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ document }) => {
  return (
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium truncate">{document.document_name}</h4>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
        <Badge variant="outline">{document.document_type}</Badge>
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          {document.created_at ? format(new Date(document.created_at), 'MMM d, yyyy') : 'Unknown date'}
        </div>
      </div>
    </div>
  );
};

export default DocumentMetadata;
