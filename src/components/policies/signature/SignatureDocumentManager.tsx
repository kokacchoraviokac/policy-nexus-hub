import React, { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Plus
} from "lucide-react";
import { Policy } from "@/types/policies";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignatureDocument {
  id: string;
  document_name: string;
  document_type: 'signed_policy' | 'client_signature' | 'authorization_form' | 'power_of_attorney' | 'other';
  file_path: string;
  uploaded_at: string;
  uploaded_by: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  version: number;
}

interface SignatureDocumentManagerProps {
  policy: Policy;
  signatureStage: string;
  onDocumentUploaded?: (document: SignatureDocument) => void;
  onDocumentDeleted?: (documentId: string) => void;
}

const SignatureDocumentManager: React.FC<SignatureDocumentManagerProps> = ({
  policy,
  signatureStage,
  onDocumentUploaded,
  onDocumentDeleted
}) => {
  const { t, formatDate } = useLanguage();
  const { toast: uiToast } = useToast();
  const [documents, setDocuments] = useState<SignatureDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - in real app this would come from API
  React.useEffect(() => {
    const mockDocuments: SignatureDocument[] = [
      {
        id: '1',
        document_name: 'Policy Document - Signed',
        document_type: 'signed_policy',
        file_path: 'policies/signed/policy_123_signed.pdf',
        uploaded_at: '2024-01-20T10:00:00Z',
        uploaded_by: 'john.doe@example.com',
        status: 'approved',
        notes: 'Client signature verified',
        version: 1
      }
    ];
    setDocuments(mockDocuments);
  }, [policy.id]);

  const getDocumentTypeLabel = (type: string) => {
    const labels = {
      signed_policy: t("signedPolicy"),
      client_signature: t("clientSignature"),
      authorization_form: t("authorizationForm"),
      power_of_attorney: t("powerOfAttorney"),
      other: t("other")
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { variant: "secondary" as const, icon: Clock, label: t("pending") },
      approved: { variant: "default" as const, icon: CheckCircle, label: t("approved") },
      rejected: { variant: "destructive" as const, icon: AlertCircle, label: t("rejected") }
    };

    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(t("invalidFileType"));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t("fileTooLarge"));
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(t("pleaseSelectFile"));
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to Supabase storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${policy.id}/signature/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const newDocument: SignatureDocument = {
        id: Date.now().toString(),
        document_name: selectedFile.name,
        document_type: 'signed_policy', // This would be configurable
        file_path: fileName,
        uploaded_at: new Date().toISOString(),
        uploaded_by: 'current_user@example.com', // This would come from auth
        status: 'pending',
        notes: uploadNotes,
        version: 1
      };

      // In real app, save to database
      console.log("Saving document metadata:", newDocument);

      setDocuments(prev => [...prev, newDocument]);
      onDocumentUploaded?.(newDocument);

      toast.success(t("documentUploadedSuccessfully"));

      // Reset form
      setSelectedFile(null);
      setUploadNotes("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error(t("errorUploadingFile"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (document: SignatureDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.document_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(t("downloadStarted"));
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error(t("downloadFailed"));
    }
  };

  const handleDelete = async (document: SignatureDocument) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }

      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== document.id));
      onDocumentDeleted?.(document.id);

      toast.success(t("documentDeleted"));
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(t("documentDeleteError"));
    }
  };

  const getRequiredDocuments = () => {
    const baseDocuments = [
      { type: 'signed_policy', label: t("signedPolicyDocument"), required: true },
      { type: 'client_signature', label: t("clientSignatureForm"), required: true },
    ];

    if (signatureStage === 'sent_to_insurer') {
      baseDocuments.push(
        { type: 'authorization_form', label: t("clientAuthorization"), required: true },
        { type: 'power_of_attorney', label: t("powerOfAttorney"), required: false }
      );
    }

    return baseDocuments;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("signatureDocuments")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Required Documents Status */}
          <div className="space-y-3 mb-6">
            <h4 className="font-medium text-sm">{t("requiredDocuments")}</h4>
            {getRequiredDocuments().map((req, index) => {
              const hasDocument = documents.some(doc => doc.document_type === req.type);
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {hasDocument ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                    <span className="text-sm">{req.label}</span>
                    {req.required && (
                      <Badge variant="outline" className="text-xs">
                        {t("required")}
                      </Badge>
                    )}
                  </div>
                  {hasDocument && (
                    <Badge variant="secondary" className="text-xs">
                      {t("uploaded")}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          <Separator className="my-4" />

          {/* Document Upload Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">{t("uploadNewDocument")}</h4>

            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  {t("clickToSelectFile")}
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, JPG, PNG (max 10MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />

            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("uploading")}
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("uploadDocument")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("uploadedDocuments")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{document.document_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getDocumentTypeLabel(document.document_type)}
                        </Badge>
                        {getStatusBadge(document.status)}
                        <span className="text-xs text-muted-foreground">
                          v{document.version}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("uploadedBy")} {document.uploaded_by} • {formatDate(document.uploaded_at)}
                      </p>
                      {document.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {document.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(document)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignatureDocumentManager;