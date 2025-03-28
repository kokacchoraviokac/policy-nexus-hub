
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FileUp, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useActivityLogger } from "@/utils/activityLogger";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { policyId } = useParams<{ policyId: string }>();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();
  const queryClient = useQueryClient();
  
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("policy");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const documentTypes = [
    { value: "policy", label: t("policyDocument") },
    { value: "invoice", label: t("invoice") },
    { value: "certificate", label: t("certificate") },
    { value: "endorsement", label: t("endorsement") },
    { value: "other", label: t("other") }
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Set document name to file name if not already set
      if (!documentName) {
        setDocumentName(selectedFile.name.split('.')[0]);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file || !documentName || !documentType || !policyId) {
      toast({
        title: t("missingInformation"),
        description: t("pleaseProvideAllRequiredFields"),
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // Get user info for company_id
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      const companyId = userData.user?.user_metadata?.company_id;
      
      if (!userId || !companyId) {
        throw new Error("User authentication information missing");
      }
      
      // Step 1: Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `policies/${policyId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Step 2: Create record in policy_documents table
      const { error: dbError } = await supabase
        .from('policy_documents')
        .insert({
          policy_id: policyId,
          document_name: documentName,
          document_type: documentType,
          file_path: filePath,
          uploaded_by: userId,
          company_id: companyId,
          version: 1
        });
      
      if (dbError) throw dbError;
      
      // Log activity
      logActivity({
        entityType: "policy",
        entityId: policyId,
        action: "update",
        details: { 
          action_type: "document_upload",
          document_name: documentName,
          document_type: documentType
        }
      });
      
      // Refresh documents list
      queryClient.invalidateQueries({ queryKey: ['policy-documents', policyId] });
      
      toast({
        title: t("uploadSuccessful"),
        description: t("documentUploadedSuccessfully"),
      });
      
      // Close dialog and reset state
      onOpenChange(false);
      setDocumentName("");
      setDocumentType("policy");
      setFile(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t("uploadFailed"),
        description: error instanceof Error ? error.message : t("somethingWentWrong"),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("uploadDocument")}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="documentName">{t("documentName")} *</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder={t("enterDocumentName")}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="documentType">{t("documentType")} *</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectDocumentType")} />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="file">{t("selectFile")} *</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            {t("cancel")}
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploading || !documentName}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("uploading")}
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                {t("upload")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
