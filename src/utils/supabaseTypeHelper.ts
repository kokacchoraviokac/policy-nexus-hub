
import { SupabaseClient } from "@supabase/supabase-js";
import { RelationName } from "@/types/common";

// Type assertion helper function for Supabase relations
export function assertRelationName(relation: string): RelationName {
  // This function doesn't actually do any runtime validation
  // It just helps TypeScript understand that the relation string
  // is actually a valid RelationName
  return relation as RelationName;
}

// Helper function to safely use Supabase from/query methods with proper types
export function safeSupabaseQuery(supabase: SupabaseClient, relation: string) {
  return supabase.from(assertRelationName(relation));
}

// Helper for checking file types
export function isImageFile(fileName: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return imageExtensions.includes(ext);
}

export function isPdfFile(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.pdf');
}

export function getFileExtension(fileName: string): string {
  return fileName.toLowerCase().substring(fileName.lastIndexOf('.') + 1);
}

export function getMimeTypeFromExtension(extension: string): string {
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
    txt: 'text/plain',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
  };

  return mimeTypes[extension] || 'application/octet-stream';
}
