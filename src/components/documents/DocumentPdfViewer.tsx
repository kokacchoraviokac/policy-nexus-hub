
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

export interface DocumentPdfViewerProps {
  url: string;
  className?: string;
}

const DocumentPdfViewer: React.FC<DocumentPdfViewerProps> = ({ url, className }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className || ''}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <iframe 
        src={url} 
        className={`w-full h-full border-0 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        title="PDF Viewer"
      />
    </div>
  );
};

export default DocumentPdfViewer;
