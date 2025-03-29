
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { entityTypeToTable } from "@/utils/documentUtils";
import type { EntityType } from "@/utils/activityLogger";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const resetForm = () => {
    setFile(null);
    setDocumentName("");
    setDocumentType("");
    setIsUploading(false);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Set document name from file name if not already set
      if (!documentName) {
        const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
        setDocumentName(fileName);
      }
    }
  };
  
  const handleUpload = async () => {
    if (!file || !documentName || !documentType) {
      toast({
        title: t("missingFields"),
        description: t("pleaseCompleteAllFields"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Get the user ID for the upload path
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const uuid = uuidv4();
      const filePath = `${user.id}/${entityType}/${entityId}/${uuid}.${fileExt}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      // Determine which table to insert into based on entity type
      const tableName = entityTypeToTable(entityType);
      
      // Insert document metadata into database
      const { error: insertError } = await supabase
        .from(tableName)
        .insert({
          document_name: documentName,
          document_type: documentType,
          file_path: filePath,
          uploaded_by: user.id,
          [`${entityType}_id`]: entityId !== "global" ? entityId : null,
          version: 1,
          company_id: user.app_metadata?.company_id
        });
        
      if (insertError) throw insertError;
      
      toast({
        title: t("uploadSuccess"),
        description: t("documentUploadedSuccessfully"),
      });
      
      // Invalidate query to refresh document list
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      
      // Close dialog and reset form
      onOpenChange(false);
      resetForm();
      
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: t("uploadError"),
        description: t("documentUploadErrorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isUploading) {
        onOpenChange(newOpen);
        if (!newOpen) resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("uploadDocument")}</DialogTitle>
          <DialogDescription>
            {t("uploadDocumentDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* File Input */}
          <div className="grid gap-2">
            <Label htmlFor="file">{t("selectFile")}</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              className="cursor-pointer"
            />
          </div>
          
          {/* Document Name */}
          <div className="grid gap-2">
            <Label htmlFor="documentName">{t("documentName")}</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              disabled={isUploading}
              placeholder={t("enterDocumentName")}
            />
          </div>
          
          {/* Document Type */}
          <div className="grid gap-2">
            <Label htmlFor="documentType">{t("documentType")}</Label>
            <Select
              value={documentType}
              onValueChange={setDocumentType}
              disabled={isUploading}
            >
              <SelectTrigger id="documentType">
                <SelectValue placeholder={t("selectDocumentType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="policy">{t("policyDocument")}</SelectItem>
                <SelectItem value="invoice">{t("invoice")}</SelectItem>
                <SelectItem value="certificate">{t("certificate")}</SelectItem>
                <SelectItem value="endorsement">{t("endorsement")}</SelectItem>
                <SelectItem value="lien">{t("lien")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Upload Button */}
          <Button 
            onClick={handleUpload} 
            disabled={!file || !documentName || !documentType || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("uploading")}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t("upload")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
