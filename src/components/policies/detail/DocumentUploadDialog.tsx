
import React from "react";
import PolicyDocumentUploadDialog from "./document/PolicyDocumentUploadDialog";
import { EntityType } from "@/types/documents";

interface DocumentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entityId: string;
  entityType: EntityType;
  originalDocumentId?: string | null;
  currentVersion?: number;
}

// This component is now a simple wrapper around the refactored PolicyDocumentUploadDialog
// to maintain backward compatibility with existing code that uses this component
const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = (props) => {
  return <PolicyDocumentUploadDialog {...props} />;
};

export default DocumentUploadDialog;
