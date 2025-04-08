
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document, DocumentApprovalStatus, EntityType, Comment } from "@/types/documents";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useDocumentApproval } from "@/hooks/useDocumentApproval";
import { toast } from "sonner";

interface DocumentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document;
}

const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  open,
  onOpenChange,
  document,
}) => {
  const { t } = useLanguage();
  const [approvalNotes, setApprovalNotes] = useState<string>("");
  
  const { updateApprovalStatus, isUpdating } = useDocumentApproval();
  
  const handleApproval = (status: DocumentApprovalStatus) => {
    updateApprovalStatus({
      documentId: document.id,
      entityType: document.entity_type as EntityType,
      status: status,
      notes: approvalNotes
    });
  };
  
  const renderApprovalStatus = () => {
    switch (document.approval_status) {
      case DocumentApprovalStatus.APPROVED:
        return (
          <Badge variant="outline" className="space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>{t("approved")}</span>
          </Badge>
        );
      case DocumentApprovalStatus.REJECTED:
        return (
          <Badge variant="destructive" className="space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{t("rejected")}</span>
          </Badge>
        );
      case DocumentApprovalStatus.PENDING:
      case DocumentApprovalStatus.NEEDS_REVIEW:
      default:
        return (
          <Badge variant="secondary" className="space-x-2">
            <Clock className="h-4 w-4" />
            <span>{t("pending")}</span>
          </Badge>
        );
    }
  };
  
  const renderUploadedBy = () => {
    return (
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={`https://avatar.vercel.sh/${document.uploaded_by_name}.png`} />
          <AvatarFallback>{document.uploaded_by_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="text-sm font-medium leading-none">{document.uploaded_by_name}</p>
          <p className="text-sm text-muted-foreground">
            {t("uploadedOn")} {formatDate(document.created_at)}
          </p>
        </div>
      </div>
    );
  };

  // Fix the rendering of comments
  const renderComments = () => {
    if (!document.comments || (Array.isArray(document.comments) && document.comments.length === 0)) {
      return (
        <div className="text-sm text-muted-foreground text-center p-4">
          No comments yet
        </div>
      );
    }
    
    // Handle both string[] and Comment[] types for comments
    const comments = Array.isArray(document.comments) ? document.comments.map(comment => {
      if (typeof comment === 'string') {
        return { 
          id: String(Math.random()),
          document_id: document.id,
          author: 'System', 
          text: comment,
          created_at: new Date().toISOString(),
          user_id: 'system'
        };
      }
      return comment as Comment;
    }) : [];
    
    return (
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="bg-muted p-3 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{comment.author}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-sm">{comment.text}</p>
          </div>
        ))}
      </div>
    );
  };
  
  const renderApprovalActions = () => {
    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="approvalNotes">{t("approvalNotes")}</Label>
          <Textarea
            id="approvalNotes"
            placeholder={t("addApprovalNotes")}
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => handleApproval(DocumentApprovalStatus.REJECTED)}
            disabled={isUpdating}
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("reject")}
          </Button>
          <Button
            onClick={() => handleApproval(DocumentApprovalStatus.APPROVED)}
            disabled={isUpdating}
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("approve")}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{document.document_name}</DialogTitle>
          <DialogDescription>
            {t("documentDetails")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">{t("documentType")}</p>
              <p className="text-sm text-muted-foreground">{document.document_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium">{t("category")}</p>
              <p className="text-sm text-muted-foreground">{document.category}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium">{t("description")}</p>
            <p className="text-sm text-muted-foreground">{document.description || t("noDescription")}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">{t("uploadedBy")}</p>
            {renderUploadedBy()}
          </div>
          
          <div>
            <p className="text-sm font-medium">{t("approvalStatus")}</p>
            {renderApprovalStatus()}
          </div>
          
          <div>
            <p className="text-sm font-medium">{t("comments")}</p>
            {renderComments()}
          </div>
          
          {document.approval_status !== DocumentApprovalStatus.APPROVED && renderApprovalActions()}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
