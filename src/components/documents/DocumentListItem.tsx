
import React, { useState } from "react";
import { 
  File, 
  FileText, 
  Image, 
  Film, 
  Music, 
  Archive, 
  FileCode, 
  Calendar, 
  MoreVertical, 
  Download, 
  Trash2,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { Document } from "@/hooks/useDocuments";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface DocumentListItemProps {
  document: Document;
  onDelete: () => void;
  isDeleting?: boolean;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onDelete,
  isDeleting = false
}) => {
  const { t } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Determine icon based on document type or extension
  const getDocumentIcon = () => {
    const extension = document.file_path?.split('.').pop()?.toLowerCase();
    
    if (document.mime_type?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    
    if (document.mime_type?.startsWith('video/') || ['mp4', 'webm', 'avi', 'mov', 'wmv'].includes(extension || '')) {
      return <Film className="h-8 w-8 text-purple-500" />;
    }
    
    if (document.mime_type?.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'flac'].includes(extension || '')) {
      return <Music className="h-8 w-8 text-green-500" />;
    }
    
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
      return <Archive className="h-8 w-8 text-amber-500" />;
    }
    
    if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json', 'xml', 'py', 'java'].includes(extension || '')) {
      return <FileCode className="h-8 w-8 text-emerald-500" />;
    }
    
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(extension || '')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    
    return <File className="h-8 w-8 text-slate-500" />;
  };
  
  // Handle document download
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);
        
      if (error) {
        throw error;
      }
      
      // Create a local URL for the downloaded file
      const url = URL.createObjectURL(data);
      
      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = document.document_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      console.error('Error downloading document:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {getDocumentIcon()}
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{document.document_name}</h4>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Badge variant="outline">{document.document_type}</Badge>
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {document.created_at ? format(new Date(document.created_at), 'MMM d, yyyy') : 'Unknown date'}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">{t("openMenu")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? t("downloading") : t("download")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentListItem;
