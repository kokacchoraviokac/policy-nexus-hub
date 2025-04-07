
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
import { Document } from "@/types/documents";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ApprovalStatus, DocumentComment } from "@/types/common";
import { supabase } from "@/integrations/supabase/client";

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

interface Comment {
  id: string;
  author: string;
  text: string;
  created_at: string;
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

    // Load comments if on the comments tab
    if (activeTab === "comments") {
      loadComments();
    }

    // Load versions if on the versions tab
    if (activeTab === "versions") {
      loadVersions();
    }
  }, [document, open, activeTab]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from("document_comments")
        .select("*")
        .eq("document_id", document.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data as Comment[]);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsAddingComment(true);
      const { data, error } = await supabase.from("document_comments").insert([
        {
          document_id: document.id,
          author: "Current User", // Replace with actual user info
          text: newComment,
          user_id: "current-user-id", // Replace with actual user ID
        },
      ]);

      if (error) throw error;
      
      // Refresh comments
      await loadComments();
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setIsAddingComment(false);
    }
  };

  const loadVersions = async () => {
    if (!document.original_document_id && !document.id) return;

    try {
      setIsLoadingVersions(true);
      const docId = document.original_document_id || document.id;
      
      const { data, error } = await supabase
        .from(document.entity_type + "_documents")
        .select("*")
        .or(`id.eq.${docId},original_document_id.eq.${docId}`)
        .order("version", { ascending: false });

      if (error) throw error;
      setVersions(data as Document[]);
    } catch (err) {
      console.error("Error loading versions:", err);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const getApprovalStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case ApprovalStatus.APPROVED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {t("approved")}
          </Badge>
        );
      case ApprovalStatus.REJECTED:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {t("rejected")}
          </Badge>
        );
      case ApprovalStatus.PENDING:
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {t("pending")}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl truncate" title={document.document_name}>
                {document.document_name}
              </DialogTitle>
              <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground mt-1">
                <span>{document.document_type}</span>
                {document.category && <span>{t(document.category)}</span>}
                <span title={new Date(document.created_at).toLocaleString()}>
                  {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                </span>
                {document.version && (
                  <span>{t("version")} {document.version}</span>
                )}
              </div>
            </div>
            {showApprovalStatus && (
              <div className="flex-shrink-0">
                {getApprovalStatusBadge(document.status as string)}
              </div>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0 flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
            <TabsTrigger value="details">{t("details")}</TabsTrigger>
            <TabsTrigger value="versions">{t("versions")}</TabsTrigger>
            <TabsTrigger value="comments">{t("comments")}</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-auto flex flex-col">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setActiveTab("details")}
                  >
                    {t("viewDetails")}
                  </Button>
                </div>
              </div>
            ) : documentUrl && (document.mime_type?.includes('image/')) ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <img 
                  src={documentUrl} 
                  alt={document.document_name} 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
            ) : documentUrl && (document.mime_type?.includes('pdf')) ? (
              <iframe 
                src={`${documentUrl}#toolbar=0`} 
                className="w-full h-full flex-1 min-h-0" 
                title={document.document_name}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t("previewNotAvailable")}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => window.open(documentUrl || '', '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t("download")}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="flex-1 overflow-auto">
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("documentName")}</h4>
                  <p>{document.document_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("documentType")}</h4>
                  <p>{document.document_type}</p>
                </div>
                {document.category && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("category")}</h4>
                    <p>{t(document.category)}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("uploadedBy")}</h4>
                  <p>{document.uploaded_by || t("unknown")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("uploadDate")}</h4>
                  <p>{new Date(document.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("fileType")}</h4>
                  <p>{document.mime_type || t("unknown")}</p>
                </div>
                {document.version && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("version")}</h4>
                    <p>{document.version}</p>
                  </div>
                )}
                {showApprovalStatus && document.status && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("approvalStatus")}</h4>
                    <div>{getApprovalStatusBadge(document.status as string)}</div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="versions" className="flex-1 overflow-auto">
            {isLoadingVersions ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : versions.length <= 1 ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-muted-foreground">{t("noOtherVersions")}</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {versions.map((version) => (
                  <div 
                    key={version.id} 
                    className={`p-3 rounded-md border ${version.id === document.id ? 'bg-muted' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{t("version")} {version.version}</span>
                          {version.id === document.id && (
                            <Badge variant="outline" className="text-xs">
                              {t("current")}
                            </Badge>
                          )}
                          {version.is_latest_version && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              {t("latest")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {version.id !== document.id && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Replace current document with this version
                            onOpenChange(false);
                            // Here you'd typically have a function to view this specific version
                          }}
                        >
                          {t("view")}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="flex-1 overflow-auto flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">{t("noComments")}</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <textarea
                  className="flex-1 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t("addComment")}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isAddingComment}
                />
                <Button 
                  onClick={addComment} 
                  disabled={!newComment.trim() || isAddingComment}
                >
                  {isAddingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {t("post")}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-2" />

        <DialogFooter className="flex-shrink-0">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2">
              {showApprovalStatus && onApprove && document.status !== ApprovalStatus.APPROVED && (
                <Button 
                  variant="outline"
                  className="text-green-700 hover:text-green-800 hover:bg-green-50"
                  onClick={onApprove}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t("approve")}
                </Button>
              )}
              
              {showApprovalStatus && onReject && document.status !== ApprovalStatus.REJECTED && (
                <Button 
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={onReject}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {t("reject")}
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {documentUrl && (
                <Button 
                  variant="outline"
                  onClick={() => window.open(documentUrl, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("download")}
                </Button>
              )}
              
              {onUploadVersion && (
                <Button 
                  variant="outline"
                  onClick={onUploadVersion}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t("uploadNewVersion")}
                </Button>
              )}
              
              {onDelete && (
                <Button 
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={onDelete}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {t("delete")}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewDialog;
