
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2, File, Check, X, Upload, UploadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useBatchDocumentUpload } from "@/hooks/useBatchDocumentUpload";
import { useLanguage } from "@/contexts/LanguageContext";
import { documentCategories } from "@/utils/documentUtils";
import { EntityType, DocumentCategory } from "@/types/documents";

interface DocumentBatchUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityType;
  entityId: string;
  onSuccess?: () => void;
}

interface FileItem {
  file: File;
  name: string;
  documentType: string;
  category: DocumentCategory | "";
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

const DocumentBatchUpload: React.FC<DocumentBatchUploadProps> = ({
  open,
  onOpenChange,
  entityType,
  entityId,
  onSuccess
}) => {
  const { t } = useLanguage();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [documentType, setDocumentType] = useState<string>("");
  const [category, setCategory] = useState<DocumentCategory | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { uploadBatch, isBatchUploading } = useBatchDocumentUpload({
    entityType,
    entityId,
    onSuccess: () => {
      if (onSuccess) onSuccess();
      onOpenChange(false);
    },
    onProgress: (filename: string, progress: number) => {
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.file.name === filename 
            ? { ...file, progress, status: "uploading" } 
            : file
        )
      );
    },
    onFileSuccess: (filename: string) => {
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.file.name === filename 
            ? { ...file, progress: 100, status: "success" } 
            : file
        )
      );
    },
    onFileError: (filename: string, error: string) => {
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.file.name === filename 
            ? { ...file, status: "error", error } 
            : file
        )
      );
    }
  });
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      name: file.name,
      documentType: documentType,
      category: category,
      status: "pending" as const,
      progress: 0
    }));
    
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, [documentType, category]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: true 
  });
  
  const handleChangeDocumentType = (value: string) => {
    setDocumentType(value);
    setFiles(prevFiles => 
      prevFiles.map(file => ({ ...file, documentType: value }))
    );
  };
  
  const handleChangeCategory = (value: string) => {
    // Cast to DocumentCategory since we verified the value is valid
    setCategory(value as DocumentCategory);
    setFiles(prevFiles => 
      prevFiles.map(file => ({ ...file, category: value as DocumentCategory }))
    );
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const handleUpload = async () => {
    setIsSubmitting(true);
    await uploadBatch(files.map(f => ({ 
      file: f.file, 
      documentName: f.name, 
      documentType: f.documentType || "other", 
      category: f.category || "other"
    })));
    setIsSubmitting(false);
  };
  
  const isUploadDisabled = 
    files.length === 0 || 
    isSubmitting || 
    isBatchUploading || 
    !documentType || 
    !category;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "error":
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("batchUploadDocuments")}</DialogTitle>
          <DialogDescription>
            {t("uploadMultipleDocumentsAtOnce")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                {t("documentType")} *
              </label>
              <Select 
                value={documentType} 
                onValueChange={handleChangeDocumentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectDocumentType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="policy">{t("policy")}</SelectItem>
                  <SelectItem value="invoice">{t("invoice")}</SelectItem>
                  <SelectItem value="claim">{t("claim")}</SelectItem>
                  <SelectItem value="contract">{t("contract")}</SelectItem>
                  <SelectItem value="report">{t("report")}</SelectItem>
                  <SelectItem value="other">{t("other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("category")} *
              </label>
              <Select 
                value={category} 
                onValueChange={handleChangeCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              {isDragActive
                ? t("dropFilesHere")
                : t("dragAndDropFilesHere")}
            </p>
            <p className="text-center text-sm text-muted-foreground mt-1">
              {t("or")}
            </p>
            <Button variant="outline" className="mt-2" type="button">
              {t("browseFiles")}
            </Button>
          </div>
          
          {files.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("fileName")}</TableHead>
                    <TableHead className="w-24">{t("fileSize")}</TableHead>
                    <TableHead className="w-28">{t("status")}</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium truncate max-w-xs">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(file.status)}
                          <span>{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(file.file.size / 1024).toFixed(0)} KB
                      </TableCell>
                      <TableCell>
                        {file.status === "pending" ? (
                          <span>{t("ready")}</span>
                        ) : file.status === "uploading" ? (
                          <div className="w-full">
                            <Progress value={file.progress} className="h-2" />
                            <span className="text-xs text-muted-foreground">
                              {file.progress}%
                            </span>
                          </div>
                        ) : file.status === "success" ? (
                          <span className="text-green-500">{t("uploaded")}</span>
                        ) : (
                          <span className="text-destructive" title={file.error}>
                            {t("error")}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={file.status === "uploading"}
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploadDisabled}
          >
            {isSubmitting || isBatchUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("uploading")} ({files.filter(f => f.status === "success").length}/{files.length})
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t("uploadFiles")} ({files.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentBatchUpload;
