
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Sparkles } from "lucide-react";
import { EntityType } from "@/types/documents";
import DocumentUploadDialog from "./DocumentUploadDialog";
import DocumentAnalysisPanel from "./DocumentAnalysisPanel";

interface EnhancedDocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
}

const EnhancedDocumentUploadDialog: React.FC<EnhancedDocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId
}) => {
  const { t } = useLanguage();
  const [uploadMode, setUploadMode] = useState<"basic" | "ai-assisted">("basic");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("uploadDocument")}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as "basic" | "ai-assisted")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="basic" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>{t("basicUpload")}</span>
            </TabsTrigger>
            <TabsTrigger value="ai-assisted" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>{t("aiAssisted")}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <DocumentUploadDialog 
              open={true}
              onOpenChange={() => {}}
              entityType={entityType}
              entityId={entityId}
              embedMode={true}
              onUploadComplete={() => onOpenChange(false)}
              onFileSelected={handleFileSelected}
            />
          </TabsContent>
          
          <TabsContent value="ai-assisted">
            <div className="grid md:grid-cols-2 gap-4">
              <DocumentUploadDialog 
                open={true}
                onOpenChange={() => {}}
                entityType={entityType}
                entityId={entityId}
                embedMode={true}
                onUploadComplete={() => onOpenChange(false)}
                onFileSelected={handleFileSelected}
              />
              
              <DocumentAnalysisPanel 
                file={selectedFile}
                documentType="policy"
                onCategoryDetected={(category) => {
                  // Implement action on category detection if needed
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedDocumentUploadDialog;
