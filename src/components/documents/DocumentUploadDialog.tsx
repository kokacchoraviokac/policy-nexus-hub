
import React from "react";
import { FileUp, Loader2, Tag, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";
import { EntityType } from "@/hooks/useDocuments";
import { Badge } from "@/components/ui/badge";

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
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
  const [tagInput, setTagInput] = React.useState("");
  
  const {
    documentName,
    setDocumentName,
    documentType, 
    setDocumentType,
    file,
    tags,
    setTags,
    uploading,
    handleFileChange,
    handleUpload,
    documentTypes
  } = useDocumentUpload({ 
    entityType,
    entityId,
    onSuccess: () => onOpenChange(false),
    originalDocumentId,
    currentVersion
  });
  
  // Set initial document name when dialog opens
  React.useEffect(() => {
    if (open && initialDocumentName) {
      setDocumentName(initialDocumentName);
    }
  }, [open, initialDocumentName, setDocumentName]);
  
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
          
          <div className="grid gap-2">
            <Label htmlFor="tags">{t("tags")}</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("addTags")}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={addTag} size="sm">
                <Tag className="h-4 w-4 mr-1" />
                {t("add")}
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
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
