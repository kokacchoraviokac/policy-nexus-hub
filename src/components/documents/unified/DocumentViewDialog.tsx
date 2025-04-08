
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText, Clock, Upload, Trash, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Document, DocumentApprovalStatus } from "@/types/documents";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Comment } from "@/types/common";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadVersion?: () => void;
  onDelete?: () => void;
  showApprovalStatus?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

const DocumentViewDialog: React.FC<DocumentViewDialogProps> = ({
  document,
  open,
  onOpenChange,
  onUploadVersion,
  onDelete,
  showApprovalStatus = false,
  onApprove,
  onReject,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [versions, setVersions] = useState<Document[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);

  useEffect(() => {
    if (!open) {
      setDocumentUrl(null);
      setIsLoading(true);
      setError(null);
      return;
    }

    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase.storage
          .from("documents")
          .createSignedUrl(document.file_path, 60);

        if (error) {
          throw error;
        }

        setDocumentUrl(data?.signedUrl || null);
      } catch (err) {
        console.error("Error loading document:", err);
        setError(t("errorLoadingDocument"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();

    // Load comments if they exist
    if (document.comments && Array.isArray(document.comments) && document.comments.length > 0) {
      setComments(document.comments as Comment[]);
    } else {
      setComments([]);
    }
    
    // Load versions if on the versions tab
    if (activeTab === "versions" && (document.original_document_id || document.id)) {
      loadVersions();
    }
  }, [document, open, activeTab]);

  const loadVersions = async () => {
    if (!document.original_document_id && !document.id) return;

    try {
      setIsLoadingVersions(true);
      const docId = document.original_document_id || document.id;
      
      const tableName = document.entity_type + "_documents";
      
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .or(`id.eq.${docId},original_document_id.eq.${docId}`)
        .order("version", { ascending: false });
        
      if (error) throw error;
      
      setVersions(data as Document[]);
    } catch (err) {
      console.error("Error loading versions:", err);
      toast({
        title: t("errorLoadingVersions"),
        description: (err as Error)?.message || t("unexpectedError"),
        variant: "destructive"
      });
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsAddingComment(true);
      
      // Instead of storing in Supabase, we'll update the local state and document.comments
      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        document_id: document.id,
        author: "Current User", // Should be replaced with actual user name
        text: newComment,
        created_at: new Date().toISOString(),
        user_id: "current-user-id", // Should be replaced with actual user ID
      };
      
      // Update local state
      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      
      // Clear input
      setNewComment("");
      
      toast({
        title: t("commentAdded"),
        description: t("commentAddedSuccessfully")
      });
    } catch (err) {
      console.error("Error adding comment:", err);
      toast({
        title: t("errorAddingComment"),
        description: (err as Error)?.message || t("unexpectedError"),
        variant: "destructive"
      });
    } finally {
      setIsAddingComment(false);
    }
  };

  const renderApprovalStatus = () => {
    switch (document.approval_status) {
      case DocumentApprovalStatus.APPROVED:
        return (
          <Badge variant="outline" className="space-x-2">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            <span>{t("approved")}</span>
          </Badge>
        );
      case DocumentApprovalStatus.REJECTED:
        return (
          <Badge variant="destructive" className="space-x-2">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            <span>{t("rejected")}</span>
          </Badge>
        );
      case DocumentApprovalStatus.PENDING:
      case DocumentApprovalStatus.NEEDS_REVIEW:
      default:
        return (
          <Badge variant="secondary" className="space-x-2">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{t("pending")}</span>
          </Badge>
        );
    }
  };

  const renderComments = () => {
    if (comments.length === 0) {
      return (
        <div className="text-sm text-muted-foreground text-center p-4">
          {t("noCommentsYet")}
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {comments.map((comment, index) => (
          <div key={comment.id || index} className="bg-muted p-3 rounded-lg">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{comment.author}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm">{comment.text}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{document.document_name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="preview" className="flex-1">{t("preview")}</TabsTrigger>
            <TabsTrigger value="details" className="flex-1">{t("details")}</TabsTrigger>
            <TabsTrigger value="comments" className="flex-1">{t("comments")}</TabsTrigger>
            {(document.version && document.version > 1) || document.original_document_id ? (
              <TabsTrigger value="versions" className="flex-1">{t("versions")}</TabsTrigger>
            ) : null}
          </TabsList>

          <TabsContent value="preview" className="py-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">{t("loadingDocument")}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 text-destructive">
                <FileText className="h-8 w-8 mb-2" />
                <p className="font-medium">{t("errorLoadingDocument")}</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            ) : documentUrl ? (
              <div className="border rounded-md overflow-hidden">
                <iframe 
                  src={documentUrl} 
                  className="w-full h-[60vh]" 
                  title={document.document_name}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <FileText className="h-8 w-8 mb-2" />
                <p className="text-sm text-muted-foreground">{t("documentNotPreviewable")}</p>
              </div>
            )}

            <div className="flex justify-end mt-4">
              {documentUrl && (
                <Button variant="outline" asChild className="mr-2">
                  <a href={documentUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    {t("download")}
                  </a>
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">{t("documentName")}</h4>
                <p className="text-sm text-muted-foreground">{document.document_name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">{t("documentType")}</h4>
                <p className="text-sm text-muted-foreground">{document.document_type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">{t("uploadedBy")}</h4>
                <p className="text-sm text-muted-foreground">{document.uploaded_by_name || t("unknown")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">{t("uploadedOn")}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(document.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">{t("category")}</h4>
                <p className="text-sm text-muted-foreground">{document.category || t("uncategorized")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">{t("version")}</h4>
                <p className="text-sm text-muted-foreground">{document.version || 1}</p>
              </div>
              {document.description && (
                <div className="col-span-2">
                  <h4 className="text-sm font-medium mb-1">{t("description")}</h4>
                  <p className="text-sm text-muted-foreground">{document.description}</p>
                </div>
              )}
              {showApprovalStatus && (
                <div>
                  <h4 className="text-sm font-medium mb-1">{t("approvalStatus")}</h4>
                  <div>{renderApprovalStatus()}</div>
                </div>
              )}
            </div>

            {showApprovalStatus && document.approval_status === DocumentApprovalStatus.PENDING && (
              <div className="space-y-2 mt-4">
                <Separator />
                <div className="flex justify-end space-x-2 mt-2">
                  <Button variant="outline" onClick={onReject}>
                    <XCircle className="h-4 w-4 mr-2" />
                    {t("reject")}
                  </Button>
                  <Button onClick={onApprove}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t("approve")}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="py-4 space-y-4">
            {renderComments()}
            
            <div className="flex space-x-2 mt-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("addComment")}
                className="flex-1 px-3 py-2 rounded-md border"
              />
              <Button
                variant="secondary"
                onClick={addComment}
                disabled={!newComment.trim() || isAddingComment}
              >
                {isAddingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {t("post")}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="versions" className="py-4">
            {isLoadingVersions ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">{t("loadingVersions")}</p>
              </div>
            ) : versions.length > 0 ? (
              <div className="border rounded-md overflow-hidden divide-y">
                {versions.map((version) => (
                  <div key={version.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{t("version")} {version.version}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("uploadedBy")} {version.uploaded_by_name || t("unknown")} • {new Date(version.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a 
                          href={`/api/documents/download/${version.id}`} 
                          download
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {t("download")}
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <p className="text-sm text-muted-foreground">{t("noVersionsFound")}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div>
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash className="h-4 w-4 mr-2" />
                {t("delete")}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {onUploadVersion && (
              <Button variant="outline" onClick={onUploadVersion}>
                <Upload className="h-4 w-4 mr-2" />
                {t("uploadNewVersion")}
              </Button>
            )}
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {t("close")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
