
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FileUploadDropzoneProps {
  onFileDrop: (acceptedFiles: File[]) => void;
  onFileSelected?: (file: File) => void;
  acceptedFileTypes?: Record<string, string[]>;
  isProcessing?: boolean;
  selectedFile?: File | null;
  icon?: React.ReactNode;
  description?: string;
  multiple?: boolean;
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onFileDrop,
  onFileSelected,
  acceptedFileTypes,
  isProcessing = false,
  selectedFile,
  icon,
  description,
  multiple = false
}) => {
  const { t } = useLanguage();
  const [localFile, setLocalFile] = useState<File | null>(selectedFile || null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (!multiple) {
        setLocalFile(acceptedFiles[0]);
        if (onFileSelected) {
          onFileSelected(acceptedFiles[0]);
        }
      }
      onFileDrop(acceptedFiles);
    }
  }, [onFileDrop, onFileSelected, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple,
    disabled: isProcessing
  });

  return (
    <div>
      {!localFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 hover:bg-accent'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            {icon || <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>}
            
            {isDragActive ? (
              <p>{t("dropFilesHere")}</p>
            ) : (
              <p>
                {description || t("dragAndDropFilesOrClickToUpload")}
              </p>
            )}
            
            <Button 
              variant="outline" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("selectFile")
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 flex flex-col items-center">
          <div className="text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">📄</span>
            </div>
            <h4 className="font-medium">{localFile.name}</h4>
            <p className="text-sm text-muted-foreground">
              {(localFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setLocalFile(null);
                if (onFileSelected) {
                  onFileSelected(null as any);
                }
              }}
              disabled={isProcessing}
            >
              {t("changeFile")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadDropzone;
