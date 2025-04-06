
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface FileUploadDropzoneProps {
  onFileChange: (file: File | null) => void;
  currentFile?: File | null;
  maxSize?: number;
  accept?: Record<string, string[]>;
  label?: string;
  description?: string;
  className?: string;
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileChange,
  currentFile,
  maxSize = 10485760, // 10MB default
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.jpg', '.jpeg', '.png'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/csv': ['.csv'],
  },
  label,
  description,
  className,
}) => {
  const { t } = useLanguage();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0]);
    }
  }, [onFileChange]);
  
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    onFileChange(null);
  };

  return (
    <div className={className}>
      {!currentFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/20'
          } ${isDragReject ? 'border-destructive' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload
              className={`h-8 w-8 ${
                isDragActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
            <p className="text-sm font-medium">
              {label || t('dropFileHereOrClickToBrowse')}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
            >
              {t('selectFile')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-md p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">{currentFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(currentFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">{t('remove')}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadDropzone;
