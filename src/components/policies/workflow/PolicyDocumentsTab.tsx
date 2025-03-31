
import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUp, FileText, AlertTriangle, FileX, Loader2 } from "lucide-react";
import { useActivityLogger } from "@/utils/activityLogger";

interface PolicyDocument {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  uploaded_by: string;
  created_at: string;
  mime_type?: string;
  category?: string;
}

interface PolicyDocumentsTabProps {
  policyId: string;
  documents: PolicyDocument[];
  isLoading: boolean;
}

const PolicyDocumentsTab: React.FC<PolicyDocumentsTabProps> = ({ 
  policyId, 
  documents, 
  isLoading 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("policy");
  const [documentName, setDocumentName] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const uploadDocument = useMutation({
    mutationFn: async () => {
      if (!file || !user) throw new Error("No file selected or user not authenticated");
      
      setIsUploading(true);
      
      try {
        // 1. Upload the file to storage
        const fileName = `${policyId}/${Date.now()}_${file.name}`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from('policy_documents')
          .upload(fileName, file);
        
        if (storageError) throw storageError;
        
        const filePath = storageData.path;
        
        // 2. Create a record in the database
        const { data, error } = await supabase
          .from('policy_documents')
          .insert({
            policy_id: policyId,
            document_name: documentName || file.name,
            document_type: documentType,
            file_path: filePath,
            mime_type: file.type,
            is_latest_version: true,
            company_id: user.company_id, // Add required company_id
            uploaded_by: user.id, // Add required uploaded_by
            version: 1 // Add default version
          })
          .select()
          .single();
        
        if (error) throw error;
        
        return data;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['policy-documents', policyId] });
      
      toast({
        title: t("documentUploaded"),
        description: t("documentUploadedSuccessfully"),
      });
      
      // Reset form
      setFile(null);
      setDocumentName("");
      
      logActivity({
        entityType: "policy_document",
        entityId: data.id,
        action: "create",
        details: {
          policy_id: policyId,
          document_type: documentType
        }
      });
    },
    onError: (error) => {
      console.error("Error uploading document:", error);
      toast({
        title: t("documentUploadFailed"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!documentName) {
        setDocumentName(selectedFile.name);
      }
    }
  };
  
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    uploadDocument.mutate();
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="space-y-4">
        <h3 className="font-medium text-lg">{t("uploadDocument")}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="document_name">{t("documentName")}</Label>
            <Input
              id="document_name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder={t("enterDocumentName")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document_type">{t("documentType")}</Label>
            <Select
              value={documentType}
              onValueChange={setDocumentType}
            >
              <SelectTrigger id="document_type">
                <SelectValue placeholder={t("selectDocumentType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="policy">{t("policyDocument")}</SelectItem>
                <SelectItem value="invoice">{t("invoiceDocument")}</SelectItem>
                <SelectItem value="lien">{t("lienDocument")}</SelectItem>
                <SelectItem value="notification">{t("notificationDocument")}</SelectItem>
                <SelectItem value="misc">{t("miscDocument")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file">{t("file")}</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            required
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!file || isUploading || uploadDocument.isPending}
          >
            {isUploading || uploadDocument.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("uploading")}
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                {t("uploadDocument")}
              </>
            )}
          </Button>
        </div>
      </form>
      
      <div className="mt-6">
        <h3 className="font-medium text-lg mb-4">{t("policyDocuments")}</h3>
        
        {documents.length === 0 ? (
          <Alert>
            <FileX className="h-4 w-4" />
            <AlertDescription>
              {t("noDocumentsUploaded")}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{doc.document_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t(doc.document_type)} • {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`${process.env.SUPABASE_URL}/storage/v1/object/public/policy_documents/${doc.file_path}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {t("view")}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyDocumentsTab;
