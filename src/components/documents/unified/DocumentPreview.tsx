import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Document } from '@/types/documents';
import { LoadingSpinner } from '@/components/ui/common';

interface DocumentPreviewProps {
  document: Document;
  width?: number | string;
  height?: number | string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  width = '100%',
  height = '400px'
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentUrl = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // If we already have a file_url, use it
        if (document.file_url) {
          setPreviewUrl(document.file_url);
          return;
        }
        
        // Otherwise, generate a signed URL from the file_path
        if (!document.file_path) {
          throw new Error('No file path available');
        }
        
        const { data, error } = await supabase.storage
          .from('documents')
          .createSignedUrl(document.file_path, 60 * 5); // 5 minutes expiry
        
        if (error) throw error;
        
        setPreviewUrl(data.signedUrl);
      } catch (err) {
        console.error('Error fetching document URL:', err);
        setError('Failed to load document preview');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocumentUrl();
  }, [document]);
  
  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <FileText className="h-12 w-12 mb-2" />
          <p>{error}</p>
        </div>
      );
    }
    
    if (!previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <FileText className="h-12 w-12 mb-2" />
          <p>No preview available</p>
        </div>
      );
    }
    
    // Handle different file types
    const fileType = document.mime_type || '';
    
    if (fileType.includes('pdf')) {
      return (
        <iframe
          src={`${previewUrl}#toolbar=0&navpanes=0`}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title={document.document_name}
        />
      );
    }
    
    if (fileType.includes('image')) {
      return (
        <img
          src={previewUrl}
          alt={document.document_name}
          className="object-contain w-full h-full"
        />
      );
    }
    
    // For other file types, show a download link
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FileText className="h-12 w-12 mb-2" />
        <p className="mb-4">Preview not available for this file type</p>
        <a 
          href={previewUrl} 
          download={document.document_name} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Download File
        </a>
      </div>
    );
  };
  
  return (
    <div 
      className="border rounded-lg overflow-hidden bg-background"
      style={{ width, height }}
    >
      {renderPreview()}
    </div>
  );
};

export default DocumentPreview;
