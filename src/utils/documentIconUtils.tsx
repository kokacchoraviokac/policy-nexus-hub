
import { 
  File, 
  FileText, 
  Image, 
  Film, 
  Music, 
  Archive, 
  FileCode, 
} from "lucide-react";
import { ReactElement } from "react";

/**
 * Get the appropriate icon based on document type or file extension
 */
export const getDocumentIcon = (filePath?: string, mimeType?: string): ReactElement => {
  const extension = filePath?.split('.').pop()?.toLowerCase();
  
  if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
    return <Image className="h-8 w-8 text-blue-500" />;
  }
  
  if (mimeType?.startsWith('video/') || ['mp4', 'webm', 'avi', 'mov', 'wmv'].includes(extension || '')) {
    return <Film className="h-8 w-8 text-purple-500" />;
  }
  
  if (mimeType?.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'flac'].includes(extension || '')) {
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
