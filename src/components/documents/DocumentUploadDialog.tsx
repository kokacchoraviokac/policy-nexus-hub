
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Loader2 } from 'lucide-react';

export interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;
  entityId: string;
  onUploadComplete?: () => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  onUploadComplete,
}) => {
  const { t } = useLanguage();
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) return;

    setIsUploading(true);
    
    try {
      // Mock file upload for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("uploadDocument")}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="documentType" className="text-right">
              {t("documentType")}
            </Label>
            <Select 
              value={documentType} 
              onValueChange={setDocumentType}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t("selectDocumentType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="policy">{t("policy")}</SelectItem>
                <SelectItem value="addendum">{t("addendum")}</SelectItem>
                <SelectItem value="invoice">{t("invoice")}</SelectItem>
                <SelectItem value="claim">{t("claim")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="documentFile" className="text-right">
              {t("file")}
            </Label>
            <Input
              id="documentFile"
              type="file"
              className="col-span-3"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              {t("description")}
            </Label>
            <Textarea
              id="description"
              className="col-span-3"
              placeholder={t("enterDocumentDescription")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={isUploading || !selectedFile || !documentType}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
