
import React from "react";
import { FileUp, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DocumentTypeSelector from "./DocumentTypeSelector";
import FileUploadField from "./FileUploadField";
import TagsInputField from "./TagsInputField";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;
  entityId: string;
  originalDocumentId?: string;
  currentVersion?: number;
  documentName?: string;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  originalDocumentId,
  currentVersion,
  documentName: initialDocumentName
}) => {
  const { t } = useLanguage();
  const [documentName, setDocumentName] = React.useState("");
  const [documentType, setDocumentType] = React.useState("document");
  const [file, setFile] = React.useState<File | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  // Set initial document name when dialog opens
  React.useEffect(() => {
    if (open && initialDocumentName) {
      setDocumentName(initialDocumentName);
    }
  }, [open, initialDocumentName]);
  
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };
  
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

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

  const handleUpload = () => {
    // This will be implemented in the future
    console.log("Upload functionality not implemented yet in the unified document system");
  };
  
  const isVersionUpdate = !!originalDocumentId;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isVersionUpdate ? t("uploadNewDocumentVersion") : t("uploadDocument")}
          </DialogTitle>
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
          
          <DocumentTypeSelector 
            value={documentType} 
            onValueChange={setDocumentType} 
          />
          
          <FileUploadField 
            onChange={handleFileChange}
            file={file}
          />
          
          <TagsInputField
            tags={tags}
            tagInput={tagInput}
            setTagInput={setTagInput}
            addTag={addTag}
            removeTag={removeTag}
            onKeyDown={handleKeyDown}
          />
          
          {isVersionUpdate && (
            <div className="bg-muted/50 p-2 rounded text-sm">
              {t("uploadingNewVersion", { version: (currentVersion || 0) + 1 })}
            </div>
          )}
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
                {isVersionUpdate ? t("uploadNewVersion") : t("upload")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
